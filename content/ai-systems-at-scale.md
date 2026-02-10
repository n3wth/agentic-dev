# Designing AI Systems That Don't Fall Apart: Key Learnings from Building at Scale

**Published:** February 2026  
**Reading Time:** 12 minutes  
**Category:** System Design

## The Problem Nobody Tells You

You build an AI agent. It works on your laptop. You deploy to production. Suddenly, the failures look nothing like your tests.

- Context windows exceed what you planned for
- Edge cases emerge that didn't show up locally
- Latency becomes a problem at scale
- Costs explode
- The model starts hallucinating

This happened to us. Multiple times. Here's what we learned.

## 1. Context Windows Will Always Be Your Bottleneck

Claude has a 200K context window. That's massive. But you'll fill it faster than you think.

**What takes up space:**
- Your codebase (if you include it: 50-100K tokens)
- Conversation history (adds up fast)
- Error messages and logs (verbose)
- API responses (often include things you don't need)

**What we did:**

Create a "context budget" for each agent:

```
Total context: 200K tokens
Reserved for:
- System prompt: 2K
- Codebase context: 30K
- Conversation history: 50K
- Working space: 50K
- Safety margin: 20K
Remaining: 48K for actual task
```

When you're near the limit, the agent should:
1. Summarize conversation history
2. Archive old context
3. Ask for clarification (don't make things up)

**Implementation:**
```typescript
const CONTEXT_BUDGET = {
  system: 2000,
  codebase: 30000,
  history: 50000,
  working: 50000,
  safety: 20000,
  task: 48000
}

async function manageContext(tokens_used) {
  if (tokens_used > CONTEXT_BUDGET.task + CONTEXT_BUDGET.safety) {
    // Summarize and archive
    await archiveConversation()
    await summarizeHistory()
  }
}
```

## 2. Hallucinations Increase with Complexity

The more an agent needs to do, the more likely it is to hallucinate.

**Example:**
"Write a feature that integrates with Stripe, uses TypeScript, connects to our database, and handles webhooks"

vs.

"Write TypeScript code to handle Stripe webhook validation"

The second is 10x more reliable.

**What we learned:**
Break tasks into smaller pieces. If something requires 10 steps, don't give the agent all 10 at once.

**How:**
```
Step 1: Agent writes webhook validation code
[Human review & approval]
Step 2: Agent writes webhook event handler
[Human review & approval]
Step 3: Agent writes integration tests
[Human review & approval]
```

This feels slower, but it's actually faster overall because you have fewer failures.

## 3. Temperature and Top-P Matter More Than You Think

Lower temperature = more consistent  
Higher temperature = more creative

For code generation: temperature=0.2 (very low, consistent)  
For ideation: temperature=0.7 (creative, varied)

**What we changed:**
```typescript
// For coding tasks
const codingParams = {
  temperature: 0.2,
  top_p: 0.9
}

// For creative tasks
const ideationParams = {
  temperature: 0.7,
  top_p: 0.95
}

// For safety-critical tasks
const safetyParams = {
  temperature: 0.1,
  top_p: 0.8
}
```

We saw a 40% reduction in nonsensical code just by lowering temperature.

## 4. Token Costs Will Blow Your Budget If You're Not Careful

Each API call costs money. Our costs looked like:

```
Month 1: $1,200 (learning phase)
Month 2: $4,800 (scaling up)
Month 3: $18,000 (oh no)
```

The problem: We were sending too much context repeatedly.

**What we optimized:**

1. **Cache long-term context** - Don't re-send your SYSTEM.md every call
   ```typescript
   const cachedSystemPrompt = async () => {
     if (cache.has('system')) return cache.get('system')
     const prompt = loadSystemPrompt()
     cache.set('system', prompt, { ttl: 3600 })
     return prompt
   }
   ```

2. **Compress codebase context** - Send diffs, not full files
   ```typescript
   // Instead of sending 50K of code
   const recentChanges = getGitDiff('HEAD~10..HEAD')
   const relevantFiles = findFilesRelevantToTask(task)
   // Send maybe 5K of actual context
   ```

3. **Reuse conversations** - Don't restart from scratch
   ```typescript
   // Bad: Every step restarts the conversation
   // Good: Continue in the same conversation, just add new messages
   ```

4. **Batch operations** - Group similar tasks
   ```typescript
   // Instead of 100 calls with 1K each = 100K input tokens
   // Batch into 5 calls with 20K each = 100K input tokens
   // (Same tokens, but fewer API calls = fewer round trips = faster)
   ```

**Result:** Month 4 cost: $4,200 (managed, predictable)

## 5. Streaming Is Essential for User Experience

Waiting 30 seconds for a response feels broken, even if it's actually fast.

**What we learned:**
Stream output as it's generated. Shows progress. Feels responsive.

```typescript
async function generateCodeWithStreaming(task) {
  const stream = await client.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: task }]
  })
  
  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      process.stdout.write(event.delta.text)
    }
  }
}
```

Users saw the code being written in real-time. Suddenly the experience felt premium, not janky.

## 6. Error Handling Must Be Defensive

Agents will encounter errors you didn't anticipate. Your system needs to handle them gracefully.

**What we built:**

```typescript
async function executeAgentTask(task) {
  const maxRetries = 3
  let attempt = 0
  
  while (attempt < maxRetries) {
    try {
      const result = await agent.execute(task)
      return { success: true, data: result }
    } catch (error) {
      attempt++
      
      if (error.type === 'context_length_exceeded') {
        // Reduce context, try again
        task.context = stripLowPriority(task.context)
        continue
      }
      
      if (error.type === 'rate_limit') {
        // Wait and retry
        await sleep(2000)
        continue
      }
      
      if (error.type === 'timeout') {
        // Break task into smaller pieces
        return await breakDownAndExecute(task)
      }
      
      // Unknown error, give up
      return { success: false, error: error.message }
    }
  }
  
  return { success: false, error: 'Max retries exceeded' }
}
```

## 7. Monitoring Is Critical

You can't manage what you don't measure.

**What we track:**

```typescript
const metrics = {
  // Latency
  'agent.latency_ms': latency,
  'agent.token_count': tokens_used,
  
  // Cost
  'agent.cost_cents': cost,
  
  // Quality
  'agent.success_rate': success / total,
  'agent.hallucination_detected': detected,
  'agent.tests_passing': passing / total,
  
  // Usage
  'agent.requests_per_hour': count,
  'agent.context_usage_percent': (used / total) * 100,
}
```

With these metrics, we caught:
- A temperature setting that was too high (quality dropped 20%)
- A code example that was teaching the agent bad patterns
- A context budget that needed adjustment

## 8. Human Review Isn't Optional

AI systems hallucinate. Period. Your job is to catch the hallucinations.

**Build review into your workflow:**

```
Agent writes code → Tests run → Human reviews → Deploy
                       ↓
                    If tests fail
                       ↓
                  Agent fixes or
                  Human provides
                  feedback
```

The human review doesn't need to be deep:
- Does this look reasonable?
- Is the approach correct?
- Are there obvious bugs?
- Is this secure?

Takes 2 minutes. Catches 90% of issues.

## 9. Model Selection Matters

We use Claude for reasoning-heavy tasks. We used GPT-4 for some tasks initially. Claude is consistently better at:
- Following instructions precisely
- Maintaining context over long conversations
- Generating production-quality code
- Admitting when it doesn't know something

For simple tasks, we use smaller models to save costs.

**Our hierarchy:**
```
Task complexity: High → Claude 3.5 Sonnet (best)
Task complexity: Medium → Claude 3.5 Haiku (good, cheaper)
Task complexity: Low → GPT-4 Mini or local model (fast, cheap)
```

## 10. Build for Failure, Not Success

Your system should degrade gracefully.

**What we designed:**

1. **If agent fails:** Fall back to human help
2. **If timeout:** Return partial result + what's missing
3. **If hallucination detected:** Ask for clarification
4. **If out of budget:** Batch work for next cycle

```typescript
async function robustExecution(task) {
  try {
    return await agent.execute(task)
  } catch (error) {
    // Fallback 1: Try simpler approach
    if (error.tokens_exceeded) {
      return await agent.executeSimplified(task)
    }
    
    // Fallback 2: Human help
    if (error.confidence_low) {
      return { status: 'needs_human', task, reason: error.reason }
    }
    
    // Fallback 3: Return what we have
    return { status: 'partial', data: partial_result, error: error.message }
  }
}
```

## Key Takeaways

Building AI systems at scale:
1. Context is limited—use it wisely
2. Complexity breeds hallucinations—break into pieces
3. Costs add up fast—monitor relentlessly
4. UX matters—stream results
5. Failures happen—handle them gracefully
6. Humans are essential—build review into workflow
7. Measure everything—you can't improve what you can't see

## Next Steps

If you're building AI systems, audit:
- **Context usage:** Are you sending too much? Can you compress?
- **Error handling:** Do you gracefully handle failures?
- **Cost:** Are you tracking? Is it in budget?
- **Quality:** Do you have metrics on success rate?
- **User experience:** Are long waits necessary?

---

**Building AI-powered systems?** [Book a consultation](#contact-form) to design a system that scales reliably.
