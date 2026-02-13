# From Prototype to Production: The 3-Stage AI Agent Deployment Pipeline

Most AI agents never make it to production. They live in notebooks, demos, and proof-of-concepts. When you try to deploy them, everything breaks.

Here's the standard problem:

**Stage 1: Prototype**
```python
# Notebook, works great
agent = MyAgent()
result = agent.run(input)
print(result)  # Perfect!
```

**Stage 2: Scale to 10 requests/second**
- Concurrency issues (threads? async? which one?)
- Memory leaks (models growing unbounded)
- Rate limit errors (you're hitting the API faster than it can handle)
- Timeout errors (requests that take 60 seconds hang the system)

**Stage 3: Production Reality**
- Someone deployed the wrong version
- Model outputs are inconsistent
- Database connections are exhausted
- Cost is 100x higher than expected
- You have no idea what's happening

The gap between prototype and production is where most AI projects die.

Here's how to fix it: the 3-stage deployment pipeline.

## Stage 1: Local Development (Instant Feedback Loop)

Your agent should work perfectly on your laptop.

```python
from agentic_dev import Agent, Pipeline

@agent
class MyAgent:
    def __init__(self):
        self.model = load_model("gpt-4")
    
    @action
    def process(self, input: str) -> str:
        response = self.model.generate(input)
        return response

# Run locally
agent = MyAgent()
result = agent.process("Hello world")
```

This gives you:
- **<100ms latency** (because you're not network-bound)
- **Full debugger access** (breakpoints, step through, inspect state)
- **Instant feedback** (change code, re-run, see results)

Key principle: Make local development so fast and easy that you never want to skip it.

Our platform makes this work by:
- Running models in-memory (Ollama integration for free local models)
- Using same code locally as in production (no translation layer)
- Providing instant validation (type checking, schema validation)

## Stage 2: Staging Environment (Find Problems Before They're Expensive)

Now scale to 100 requests/second and find the issues.

```python
# Deploy to staging
agent = MyAgent()
pipeline = Pipeline(agent)
pipeline.deploy("staging")

# Run realistic load test
load_test = LoadTest(
    requests_per_second=100,
    duration_seconds=300,
    input_distribution="realistic"
)
pipeline.run_load_test(load_test)
```

What you're looking for:

**1. Performance Issues**
```
p50 latency: 50ms ✓
p95 latency: 200ms ✓
p99 latency: 2000ms ✗  (needs optimization)
```

If p99 is too high, you have time to fix it before production.

**2. Memory Issues**
```
Memory after 10k requests: 256MB ✓
Memory after 100k requests: 4GB ✗  (memory leak)
```

Find leaks in staging, not production.

**3. Concurrency Issues**
```
100 concurrent requests: ✓ All succeed
1000 concurrent requests: ✗ 47 timeout, 12 crash
```

This tells you what your actual max throughput is.

**4. Cost Issues**
```
Cost per 1000 requests in staging: $0.50
Projected monthly cost at production volume: $15,000
(Is that acceptable?)
```

If the math doesn't work, you catch it here.

### Staging Monitoring Template

Set up these metrics before you start:

```python
pipeline.monitor(
    metrics=[
        "latency_p50",
        "latency_p95", 
        "latency_p99",
        "error_rate",
        "memory_usage",
        "cpu_usage",
        "model_confidence",
        "cost_per_request",
    ],
    alerts={
        "latency_p99 > 2000ms": AlertLevel.WARNING,
        "error_rate > 1%": AlertLevel.CRITICAL,
        "memory_usage > 80%": AlertLevel.WARNING,
    }
)
```

Fix anything with a CRITICAL alert. Staging should be boring and predictable.

## Stage 3: Production Deployment (Make It Boring)

When staging looks good, production should be a boring copy-paste.

```python
# Deploy to production
pipeline.deploy("production")

# Gradual rollout (not all traffic at once)
pipeline.rollout(
    initial_traffic=5,  # 5% of traffic to new version
    increase_every=300,  # Increase every 5 minutes
    final_traffic=100,   # Eventually 100%
    abort_if_error_rate > 2,  # Auto-rollback if errors spike
)
```

This is called **canary deployment**. It protects you from:
- Buggy code making it to production
- Unforeseen edge cases
- Performance regressions

### Production Observability

You need different metrics in production:

```python
@agent
class MyAgent:
    @action
    @monitor(
        log_inputs=True,
        log_outputs=True,
        log_latency=True,
        log_errors=True,
        sample_rate=0.1,  # Log 10% of requests, not all
    )
    def process(self, input: str) -> str:
        return self.model.generate(input)
```

This gives you:
- **Perfect audit trail** (see every decision)
- **Performance baselines** (know when things degrade)
- **Error patterns** (know what to fix first)
- **Cost visibility** (know if you're burning money)

### Incident Response

When something breaks, you need to know instantly:

```python
pipeline.alerts(
    on_error_rate_spike={
        "threshold": 2,  # 2% error rate
        "window": 60,    # over 1 minute
        "action": "page_oncall"
    },
    on_latency_spike={
        "threshold": 2000,  # 2 second latency
        "window": 60,
        "action": "page_oncall"
    },
    on_cost_spike={
        "threshold": 1.5,  # 50% higher than expected
        "window": 3600,    # over 1 hour
        "action": "slack_notification"
    }
)
```

When an alert fires, you can instantly:
```python
# See what changed
pipeline.debug("production")

# See the last 100 requests that failed
pipeline.inspect_errors(limit=100)

# Replay a specific failing request
pipeline.replay_request(request_id="req_xyz")

# Rollback if needed
pipeline.rollback("production")
```

## The Checklist: Before You Deploy

Use this before moving from staging to production:

- [ ] p99 latency is acceptable (<2000ms for most agents)
- [ ] Error rate is <1% under load
- [ ] Memory usage is stable (not growing over time)
- [ ] Cost per request is within budget
- [ ] You can scale to 10x your expected peak load
- [ ] All edge cases from monitoring are handled
- [ ] You have alerts set up for critical metrics
- [ ] You can rollback in <5 minutes
- [ ] You can see every decision the agent makes (logging)
- [ ] You've tested with real data (not just synthetic test cases)

## Real Example: The Successful Migration

We migrated a customer support agent from manual routing to AI-driven dispatch:

**Stage 1: Local Development** (1 week)
- Agent works perfectly on laptop
- Processes support tickets, routes to right team
- We can debug issues in minutes

**Stage 2: Staging** (2 weeks)
- Tested with 1 year of historical support tickets
- Found 3 issues:
  - Complex edge cases needed special handling
  - Model was slower than expected on legal documents
  - Cost was 5x our estimate
- Fixed all 3, optimized for performance, re-tested
- Final: 200ms latency, 0.1% error rate, $0.02 per ticket

**Stage 3: Production** (1 week)
- Deployed to 5% of traffic (200 tickets/day)
- Monitored for 3 days, everything perfect
- Increased to 50% of traffic
- Increased to 100% of traffic
- Now processes 4,000 support tickets/day automatically

**Result:** Freed up 3 people from manual routing. Agent catches 95% of routing decisions. Humans only need to handle edge cases.

## Key Takeaways

1. **Local development is essential.** Make it so fast that you can run thousands of experiments.

2. **Staging catches 90% of production problems.** Load test everything. Measure everything.

3. **Production is boring.** If you've done staging right, production is just a copy-paste that works.

4. **Observability is non-negotiable.** You can't fix what you can't see. Log everything.

5. **Gradual rollout is your safety net.** Canary deployments catch issues before they affect all users.

---

**Ready to deploy your first agent?**

We have templates and guides for every stage. Pick a problem, build an agent, deploy it to staging, test it, then go live. The process is the same every time.

That's why it works.
