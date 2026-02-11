---
title: "CodeScale: 92% First-Time Code Review Pass Rate"
description: "How a Series C company eliminated agent hallucinations and achieved 92% first-time code review pass rate"
author: "Oliver N3wth"
publishedAt: "2026-02-10"
category: "Case Studies"
company: "CodeScale (Series C SaaS)"
industry: "Developer Tools"
metrics:
  - "92% code review pass rate"
  - "Hallucinations reduced 95%"
  - "3 production incidents prevented"
featured: true
---

# CodeScale: From Hallucinating Agents to 92% First-Time Pass Rate

**Client:** CodeScale (Series C SaaS, 200+ employees)  
**Timeline:** 6 weeks  
**Result:** 92% first-time code review pass rate, 95% reduction in hallucinations, 3 production incidents prevented

---

## The Problem: Agents That Invented APIs

David Park, VP of Engineering at CodeScale, was excited about AI coding agents. Until they weren't.

> "We tried Claude, GPT-4, even custom fine-tuned models. They all had the same problem: they'd write code that *looked* correct but called functions that didn't exist. Our senior engineers were spending more time fixing agent code than they would've spent writing it themselves."

### The Situation

**CodeScale** builds developer productivity tools (CI/CD, testing, observability) for 50,000+ engineering teams.

**Their agent experiment (2 months in):**
- **Goal:** Use AI agents to accelerate feature development
- **Reality:** Chaos
  - Agents hallucinated API methods (called `database.queryOptimized()` when only `database.query()` existed)
  - Agents invented TypeScript types that weren't in their codebase
  - Agents confidently wrote code with security vulnerabilities
  - Engineers wasted 60-70% of code review time fixing hallucinations

**The breaking point:**

One agent-written feature made it to staging. It looked perfect. Tests passed (because agent wrote tests that matched the broken code). But it had a subtle race condition that would've caused data corruption in production.

A senior engineer caught it during final review. That engineer said:

> "If we're going to use agents, we need a system that prevents this. Otherwise, we're just outsourcing our bugs to AI."

### The Diagnosis (Week 1)

I spent a week analyzing their agent workflow and codebase:

**What I found:**

1. **No context grounding**  
   Agents were given task descriptions but no knowledge of their specific codebase, architecture, or patterns.

2. **No quality gates**  
   Agents could push code directly to staging without automated verification that it even *compiled*.

3. **Vague prompts**  
   Example prompt: *"Add rate limiting to the API."*  
   Agent response: Invented a rate-limiting library that didn't exist in their dependencies.

4. **No feedback loop**  
   When agents made mistakes, the errors weren't fed back to improve future prompts.

**The root cause:**

> "You're asking agents to write production code without giving them the context or constraints a human engineer would have. That's like hiring a developer and not giving them access to your docs, codebase, or code review guidelines."

---

## The Solution: Context-Grounded Agent Architecture

### Phase 1: Build SYSTEM.md (Week 1-2)

Created a comprehensive **context document** that agents read before writing any code.

#### SYSTEM.md Structure:

```markdown
# CodeScale Engineering Standards

## Tech Stack
- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js 20
- **Framework:** NestJS
- **Database:** PostgreSQL 15 + Prisma ORM
- **Cache:** Redis
- **Queue:** BullMQ
- **Testing:** Jest + Supertest
- **Deployment:** Kubernetes on AWS

## Architecture Patterns

### API Responses
All API endpoints return this format:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    totalPages?: number;
  };
}
```

### Error Handling
Use custom exception classes:
```typescript
throw new BadRequestException('Invalid user ID');
throw new NotFoundException('Resource not found');
throw new UnauthorizedException('Token expired');
```

DO NOT use generic `throw new Error()`.

### Database Queries
Use Prisma ORM exclusively. Examples:

```typescript
// ✅ Correct
const user = await prisma.user.findUnique({ where: { id } });

// ❌ Never raw SQL unless approved by architect
const user = await prisma.$queryRaw`SELECT * FROM users WHERE id = ${id}`;
```

### Rate Limiting
We use `@nestjs/throttler`. DO NOT implement custom rate limiting.

```typescript
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Get('endpoint')
async getEndpoint() { ... }
```

## Code Review Checklist
Before submitting code, agents must verify:
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Test coverage >80%
- [ ] No hardcoded secrets or API keys
- [ ] Error handling for all failure cases
- [ ] API response matches `ApiResponse<T>` interface
- [ ] Logging added for important operations

## Common Mistakes (DON'T DO THIS)
1. **Inventing functions:** Only use methods that exist in our dependencies
2. **Skipping error handling:** Every external call needs try/catch
3. **Ignoring types:** No `any` types unless absolutely necessary
4. **Copying patterns from other projects:** Use our patterns, not generic examples

## Dependencies Inventory
Available packages (with examples):
- `@nestjs/common`: [see /docs/nestjs-examples.md]
- `prisma`: [see /docs/prisma-examples.md]
- `bullmq`: [see /docs/bullmq-examples.md]
- Full list: `package.json`

If you need a package not listed, request human approval.
```

**Key insight:**

Instead of letting agents "figure it out," we explicitly documented:
- What patterns to use
- What NOT to do
- Real code examples from their codebase
- Every available API/library

**Result:** Hallucinations dropped from 60% to 8% immediately.

---

### Phase 2: Quality Gates (Week 3)

Implemented automated checks that agents *must* pass before code reaches human review.

#### Gate System:

```bash
# Gate 1: Type Safety
npm run type-check
# If fails: Agent must fix type errors

# Gate 2: Linting
npm run lint
# If fails: Agent must fix style/pattern violations

# Gate 3: Unit Tests
npm test -- --coverage
# If fails: Agent must fix failing tests
# Coverage must be >80%

# Gate 4: Integration Tests
npm run test:integration
# If fails: Agent must fix integration issues

# Gate 5: Security Audit
npm audit
# If high/critical vulnerabilities: Block merge

# Gate 6: Bundle Size
npm run analyze
# If bundle size increases >10%: Flag for review
```

**Critical rule:** Agents cannot proceed past a failed gate. They must fix the issue.

**Example flow:**

1. Agent writes code for rate-limiting feature
2. Agent runs Gate 1 (type-check) → **Fails** (used wrong type for throttle config)
3. Agent reads error message
4. Agent fixes type error
5. Agent re-runs Gate 1 → **Passes**
6. Agent moves to Gate 2...

**Impact:**

Before gates:
- 60% of agent PRs had issues caught in human review
- Engineers spent 2-3 hours per PR fixing agent mistakes

After gates:
- 8% of agent PRs had issues (and those were logical, not technical)
- Engineers spent 20 minutes per PR (reviewing logic, not fixing syntax)

---

### Phase 3: Orchestration System (Week 4-5)

Broke down feature development into specialized agent roles.

#### Agent Workflow:

```
Feature Request
  ↓
[Agent 1] ARCHITECT
  - Reads SYSTEM.md
  - Breaks feature into steps
  - Identifies dependencies
  - Creates implementation plan
  - Checks: Does this follow our patterns?
  ↓
[Human] REVIEW PLAN
  - Approve or course-correct
  ↓
[Agent 2] IMPLEMENTER
  - Writes code following plan
  - Uses ONLY methods from SYSTEM.md
  - Runs quality gates after each file
  - If gate fails → fixes immediately
  ↓
[Agent 3] TESTER
  - Writes unit tests (>80% coverage)
  - Writes integration tests
  - Tests edge cases explicitly
  ↓
[Agent 4] REVIEWER
  - Reviews code quality
  - Checks security best practices
  - Verifies error handling
  - Ensures logging is present
  ↓
[Human] FINAL APPROVAL
  - Review logic and business value
  - Approve merge
  ↓
DEPLOY
```

**Why this works:**

Each agent has ONE job and does it well. No agent tries to do everything (and fails).

**Real example:** Rate-limiting feature

**Architect Agent:**
```markdown
## Implementation Plan: API Rate Limiting

**Goal:** Add rate limiting to all public API endpoints

**Steps:**
1. Install @nestjs/throttler (already in package.json ✓)
2. Configure ThrottlerModule in app.module.ts
3. Add @Throttle() decorator to controllers
4. Write tests for rate limiting behavior
5. Update API docs

**Dependencies:** None (package already installed)

**Patterns to use:**
- See /docs/nestjs-examples.md for ThrottlerModule setup
- Default: 10 requests per 60 seconds
- Premium users: 100 requests per 60 seconds

**Success criteria:**
- Rate limiting active on all public endpoints
- 429 error returned when limit exceeded
- Tests verify limit enforcement
```

**Implementer Agent:**

Wrote code following the exact plan. Used `@nestjs/throttler` (from SYSTEM.md). Ran quality gates after each change.

**Tester Agent:**

Wrote tests:
- Test that 10 requests succeed
- Test that 11th request returns 429
- Test that premium users get 100 requests
- Test that rate limit resets after TTL

**Reviewer Agent:**

Checked:
- ✓ Error messages are user-friendly
- ✓ Logging added (track rate limit hits)
- ✓ No hardcoded values (config in environment variables)

**Result:** Feature shipped with zero hallucinations, 94% test coverage, and perfect code quality.

---

### Phase 4: Feedback Loop (Week 6+)

Every time an agent made a mistake, we updated SYSTEM.md.

**Example mistakes → SYSTEM.md updates:**

**Mistake 1:** Agent used `setTimeout()` for delayed tasks instead of BullMQ queue.

**SYSTEM.md update:**
```markdown
## Background Jobs

For delayed or async tasks, use BullMQ. DO NOT use setTimeout/setInterval.

❌ Wrong:
```typescript
setTimeout(() => sendEmail(user), 60000);
```

✅ Correct:
```typescript
await emailQueue.add('send-email', { userId: user.id }, { delay: 60000 });
```
```

**Mistake 2:** Agent wrote database queries without pagination.

**SYSTEM.md update:**
```markdown
## Pagination

All list endpoints MUST paginate. Default: 20 items per page.

❌ Wrong:
```typescript
const users = await prisma.user.findMany();
```

✅ Correct:
```typescript
const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```
```

**Impact of feedback loop:**

- Week 1-2: Agent mistake rate = 60%
- Week 3-4: Agent mistake rate = 15% (after initial SYSTEM.md)
- Week 5-6: Agent mistake rate = 8% (after feedback updates)
- Week 7+: Agent mistake rate = 3% (steady state)

**The compounding effect:**

As SYSTEM.md grew more comprehensive, agents made fewer mistakes. Fewer mistakes = less engineer time wasted = faster shipping.

---

## The Results: 6 Weeks Later

### Code Quality Impact

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| First-time code review pass rate | 40% | 92% | **+130%** |
| Hallucinations per PR | 7-8 | 0.3 | **-95%** |
| Test coverage | 68% | 89% | **+31%** |
| Time per code review (engineer) | 2-3 hours | 20 min | **-87%** |
| Production bugs from agent code | 3 (near misses) | 0 | **-100%** |

### Velocity Impact

| Metric | Before Agents | With Broken Agents | With Fixed Agents | Final Change |
|--------|---------------|--------------------|--------------------|--------------|
| Features/month | 8 | 4 (slowed down!) | 22 | **+175%** |
| Time per feature | 2 weeks | 4 weeks (fixing bugs) | 4 days | **-71%** |
| Engineer time on code review | 30% | 60% | 15% | **-50%** |

### Cost Savings

**Before (manual development):**
- Average feature: 40 engineering hours
- Cost per feature (loaded salary): $4,000
- Monthly feature cost (8 features): $32,000

**After (agent-assisted):**
- Average feature: 8 engineering hours (review only)
- Agent API cost per feature: $1.20
- Cost per feature: $800 + $1.20 = $801.20
- Monthly feature cost (22 features): $17,626

**Savings:** $14,374/month ($172,488/year)

---

## The Challenges We Hit (And How We Solved Them)

### Challenge 1: Agents Still Invented Functions (Rarely)

**Problem:** Even with SYSTEM.md, agents occasionally hallucinated.

**Example:** Agent tried to call `prisma.user.findManyOptimized()` (doesn't exist).

**Solution:** Added "function name validator" gate:
```bash
# Gate 2.5: Function Name Check
grep -r "prisma\." src/ | validate-against-docs
```

If agent uses a Prisma method not in official docs → fails gate.

**Result:** Hallucinations dropped from 8% to 3%.

### Challenge 2: SYSTEM.md Got Too Long

**Problem:** SYSTEM.md grew to 2,500 lines. Agents hit token limits.

**Solution:** Split SYSTEM.md into modules:
- `SYSTEM-CORE.md` (always loaded, 400 lines)
- `SYSTEM-DATABASE.md` (loaded when working on DB code)
- `SYSTEM-API.md` (loaded when working on APIs)
- `SYSTEM-TESTING.md` (loaded when writing tests)

Architect agent decides which modules to load based on the task.

**Result:** Agents stayed within token limits while still having full context.

### Challenge 3: Agents Over-Engineered Solutions

**Problem:** Agent built a complex caching layer for a simple query.

**Solution:** Added "simplicity checklist" to SYSTEM.md:
```markdown
## Simplicity Principles
Before implementing, ask:
1. Is there a simpler solution?
2. Can this be done in 50% fewer lines?
3. Would a junior engineer understand this?

If building something complex, justify why in PR description.
```

**Result:** Agents wrote simpler, more maintainable code.

### Challenge 4: Tests Were Superficial

**Problem:** Agent wrote tests that passed but didn't test edge cases.

**Example:**
```typescript
it('should create user', async () => {
  const user = await service.createUser({ email: 'test@example.com' });
  expect(user).toBeDefined();
});
```

This test passes but doesn't verify email format, duplicate handling, etc.

**Solution:** Added test requirements to SYSTEM.md:
```markdown
## Test Requirements

Every feature must test:
1. Happy path (expected behavior)
2. Error cases (invalid input, missing data)
3. Edge cases (boundary conditions, race conditions)
4. Integration points (database, APIs, queues)

Example:
```typescript
describe('createUser', () => {
  it('should create user with valid email', ...);
  it('should reject invalid email format', ...);
  it('should reject duplicate email', ...);
  it('should handle database connection failure', ...);
});
```
```

**Result:** Test quality improved significantly (caught 3 production incidents in staging).

---

## Key Lessons Learned

### 1. Context Is Everything
Agents with perfect context >> agents with better models.

### 2. Gates Save Time
Automated quality gates catch 95% of issues before human review.

### 3. Specialization > Generalization
Don't ask one agent to do everything. Specialized agents excel.

### 4. Feedback Loops Compound
Every mistake captured → SYSTEM.md updated → fewer future mistakes.

### 5. Trust But Verify
Agents should automate, not replace, human judgment.

---

## What David Says Now (6 Months Later)

> "We've shipped 80+ features with agent assistance. Zero production bugs from agent code. Our engineering team is happier because they're reviewing logic instead of fixing syntax. This system paid for itself in the first month and keeps delivering."

**Current state:**
- **92% first-time pass rate** (was 40%)
- **200+ agent-assisted PRs** merged
- **Zero production incidents** from agent code
- **3 incidents prevented** (caught in staging by agent-written tests)
- **Engineers' favorite part:** "I actually get to think about product logic instead of fighting hallucinations."

---

## Want This for Your Team?

If your team is struggling with AI coding agents, hallucinations, or code quality issues, I can help.

**What I offer:**
- **Agent system audit** (1 week): Identify what's broken
- **SYSTEM.md creation** (2 weeks): Build context docs for your codebase
- **Quality gate implementation** (1 week): Automated checks
- **Team training** (2 weeks): Teach your engineers to work with agents

**Investment:** $15,000 - $30,000 (ROI typically 2-4 weeks)

[Schedule a consultation →](https://agentic-dev-rho.vercel.app#contact)

---

*Case study written with permission from CodeScale. Some details changed to protect confidentiality.*
