# Autonomous Agent Checklist
## Deploy Safely in Production (No Disasters Required)

Before you deploy an autonomous agent to production, use this checklist. It prevents 90% of the problems we see.

## Phase 1: Permission Boundaries (Before Development)

- [ ] Define what actions the agent CAN do
  - [ ] Read operations only? Or write too?
  - [ ] Which databases/APIs can it touch?
  - [ ] Which operations require human review?
  
- [ ] Define what the agent CANNOT do
  - [ ] Can it delete data? (Generally: no)
  - [ ] Can it send external communications? (If yes: log everything)
  - [ ] Can it modify user data? (If yes: track all changes)
  - [ ] Can it affect billing? (Generally: no)

- [ ] Create the permission matrix
  - [ ] Action | Allowed | Logged | Requires Review | Timeout
  - [ ] Run this by Legal/Security/Compliance
  - [ ] Get sign-off from stakeholders

- [ ] Document edge cases
  - [ ] What happens if API is down?
  - [ ] What happens if response time exceeds 30 seconds?
  - [ ] What happens if the agent gets confused?
  - [ ] What happens if user permissions change mid-action?

## Phase 2: State & Decision Transparency (During Development)

- [ ] Build explicit state machines
  - [ ] No emergent behavior (keep it boring)
  - [ ] Every state transition logged
  - [ ] Every decision logged with reasoning
  - [ ] Confidence scores attached to decisions

- [ ] Add decision tracing
  - [ ] Developer can replay any action
  - [ ] Logic is visible (not a black box)
  - [ ] Each decision point has a reason
  - [ ] Human can override mid-action

- [ ] Implement graceful degradation
  - [ ] If uncertain, ask a human (don't guess)
  - [ ] If blocked, fail safely (don't retry infinitely)
  - [ ] If resource-constrained, queue and wait (don't error)
  - [ ] If permission denied, escalate (don't ignore)

- [ ] Version everything
  - [ ] Agent version tracked
  - [ ] Action history timestamped
  - [ ] Rollback path available
  - [ ] Change log maintained

## Phase 3: Monitoring & Observability (Before Launch)

- [ ] Set up real-time alerts
  - [ ] Alert on error rate > 1%
  - [ ] Alert on response time > expected baseline
  - [ ] Alert on unusual action patterns
  - [ ] Alert on permission boundaries being tested

- [ ] Build operational dashboards
  - [ ] Actions per hour (throughput)
  - [ ] Error rate (quality)
  - [ ] Human override rate (decision quality)
  - [ ] Decision confidence scores (uncertainty trend)

- [ ] Create audit logs
  - [ ] Who triggered the action?
  - [ ] What decision was made?
  - [ ] What was the reasoning?
  - [ ] What was the outcome?
  - [ ] What changed?

- [ ] Set up escalation paths
  - [ ] Slack alerts for critical issues
  - [ ] Pagerduty for P0 problems
  - [ ] Daily report of anomalies
  - [ ] Weekly review of decisions

## Phase 4: Human-in-the-Loop Design (During Development)

- [ ] Identify human review points
  - [ ] Which actions always need approval?
  - [ ] Which actions need approval only if risky?
  - [ ] Which actions need approval if uncertain?
  - [ ] Which actions never need approval?

- [ ] Design approval workflows
  - [ ] Single approver? Or committee?
  - [ ] SLA for approval (< 1 hour? < 4 hours?)
  - [ ] What info does approver see?
  - [ ] Can approver modify action before approving?

- [ ] Plan for human override
  - [ ] Can humans cancel mid-action? How?
  - [ ] Can humans roll back completed actions?
  - [ ] What's the manual workaround if agent breaks?
  - [ ] Who's on-call if issues happen at 3am?

- [ ] Build feedback loops
  - [ ] Does agent learn from rejections?
  - [ ] Does agent learn from corrections?
  - [ ] How often should feedback be incorporated?
  - [ ] Who reviews agent learning?

## Phase 5: Testing & Validation (Before Production)

### Functional Testing
- [ ] Happy path works end-to-end
- [ ] Edge cases handled gracefully
- [ ] All error states tested
- [ ] Permissions enforced correctly
- [ ] Logging captures all decisions

### Chaos Testing
- [ ] API timeout → agent handles it
- [ ] Database down → agent handles it
- [ ] Permission denied → agent escalates
- [ ] Concurrent requests → no race conditions
- [ ] Out of memory → graceful degradation

### Performance Testing
- [ ] Latency acceptable (< 30 seconds for most actions)
- [ ] Throughput acceptable (target: X actions/hour)
- [ ] Resource usage acceptable (CPU/memory)
- [ ] No memory leaks over 24 hours
- [ ] Scalability proven under load

### Security Testing
- [ ] Cannot access restricted data
- [ ] Cannot escalate permissions
- [ ] Cannot bypass approval workflows
- [ ] No SQL injection vulnerabilities
- [ ] No credential exposure in logs

## Phase 6: Staged Rollout (Go Live Safely)

- [ ] Stage 1: Sandbox environment
  - [ ] 100% of actions logged
  - [ ] No real user impact
  - [ ] Run for 1 week minimum
  - [ ] Zero errors before proceeding

- [ ] Stage 2: Shadow mode (reads only)
  - [ ] Agent runs alongside existing system
  - [ ] Compares output, never modifies data
  - [ ] Measures accuracy
  - [ ] Run for 1-2 weeks minimum
  - [ ] >99% accuracy before proceeding

- [ ] Stage 3: Limited rollout
  - [ ] 10% of operations (or 1 customer cohort)
  - [ ] All actions still logged and monitored
  - [ ] Human override available
  - [ ] SLA: <1% error rate
  - [ ] Run for 1 week minimum

- [ ] Stage 4: Full rollout
  - [ ] 100% of operations
  - [ ] Monitoring active
  - [ ] Human override still available
  - [ ] Daily reviews for first month
  - [ ] Weekly reviews thereafter

## Phase 7: Post-Deployment (Ongoing)

- [ ] Daily monitoring (first week)
  - [ ] Error rate
  - [ ] Decision quality
  - [ ] Human override rate
  - [ ] Any anomalies?

- [ ] Weekly reviews (first month)
  - [ ] Trend analysis
  - [ ] Decision log audit
  - [ ] Performance metrics
  - [ ] Team feedback

- [ ] Monthly reviews (ongoing)
  - [ ] Success metrics
  - [ ] Operational efficiency
  - [ ] Learned improvements
  - [ ] New risks?

- [ ] Quarterly strategy reviews
  - [ ] Are we using it as intended?
  - [ ] What's the ROI?
  - [ ] Should we expand scope?
  - [ ] Are there safer ways to do this?

## Red Flags (If You See These, Fix Before Deploying)

❌ "We don't have monitoring built yet" → Build it first  
❌ "The agent is a black box; we can't explain its decisions" → Redesign  
❌ "We haven't tested failure modes" → Test them  
❌ "Nobody knows who approves escalations" → Define it  
❌ "We can't roll back if it breaks" → Plan rollback first  
❌ "We've never run this at scale" → Prove it first  
❌ "The team is excited but nervous" → That's okay. Go slow anyway.  

## Success Metrics (After Launch)

- **Error rate:** < 0.5%
- **Mean time to detect problems:** < 5 minutes
- **Mean time to recovery:** < 30 minutes
- **Human override rate:** < 5% (means agent is reliable)
- **Team confidence:** 8/10 minimum

---

**This checklist prevents disasters.**

Use it. Check every box. Be boring about reliability.

That's how autonomous agents succeed.

---

*Need help designing autonomous systems? We work with teams that want to deploy safely.*

[→ Schedule an architecture review](/contact)
