# The 12-Factor App Model for AI Services (Complete Guide)

*Published: February 2026*

The original 12-Factor App methodology revolutionized how we build cloud-native applications. But it was written in 2011—before LLMs, vector databases, and AI agents.

**AI services have unique challenges:**
- Non-deterministic outputs
- Token costs that scale with usage
- Model version dependencies
- Prompt engineering as "code"
- Stateful conversations
- Hallucination monitoring

After deploying dozens of AI services to production, I've adapted the 12-Factor methodology for the AI era.

Here's the complete guide.

## I. Codebase: One Codebase, One Service (Including Prompts)

**Original principle:** One codebase tracked in version control, many deploys.

**AI adaptation:** **Treat prompts as code.** Version control everything that affects behavior.

### What to Version Control

**Code (obvious):**
```
/src
  /agents
  /models
  /api
```

**Prompts (critical):**
```
/prompts
  /system
    customer-support-agent.txt
    code-review-agent.txt
  /templates
    email-generation.jinja2
    summarization.txt
```

**Model configurations:**
```
/config
  /models
    gpt-4-config.yaml
    claude-config.yaml
```

**Evaluation datasets:**
```
/evals
  /test-cases
    customer-support-scenarios.jsonl
    hallucination-tests.jsonl
```

**Why:** Prompts change behavior as much as code does. Treat them the same.

### Anti-Pattern: Inline Prompts

```python
# BAD: Prompt in code
def generate_summary(text):
    prompt = "Summarize this: " + text  # Hard to track, version, test
    return llm.generate(prompt)

# GOOD: Prompt in version control
def generate_summary(text):
    prompt_template = load_prompt("prompts/summarization.txt")
    prompt = prompt_template.format(text=text)
    return llm.generate(prompt)
```

**Benefit:** Rollback prompts independently of code, A/B test prompts, audit changes.

## II. Dependencies: Explicitly Declare and Isolate Dependencies

**AI adaptation:** **Lock model versions and track provider SDKs.**

### Model Version Pinning

```yaml
# requirements.txt
openai==1.12.0  # Pin SDK version

# config/models.yaml
models:
  primary:
    provider: openai
    model: gpt-4-0125-preview  # Pin model version
    temperature: 0.0
  fallback:
    provider: anthropic
    model: claude-3-opus-20240229  # Pin model version
```

**Why:** Model versions change behavior. GPT-4-turbo in Jan != GPT-4-turbo in March.

### Dependency Isolation

```dockerfile
# Dockerfile for AI service
FROM python:3.11-slim

# Install dependencies with locked versions
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . /app
WORKDIR /app

CMD ["python", "main.py"]
```

**Critical:** Model behavior can change silently. Pin everything.

## III. Config: Store Config in the Environment

**AI adaptation:** **Separate prompts (code) from config (environment).**

### Environment-Specific Config

```bash
# .env.development
OPENAI_API_KEY=sk-dev-...
MODEL=gpt-4o-mini
TEMPERATURE=0.7
MAX_TOKENS=500
LOG_LEVEL=DEBUG
ENABLE_CACHING=false

# .env.production
OPENAI_API_KEY=sk-prod-...
MODEL=gpt-4
TEMPERATURE=0.0
MAX_TOKENS=500
LOG_LEVEL=INFO
ENABLE_CACHING=true
```

### What Goes in Environment

**YES:**
- API keys
- Model selection (gpt-4 vs gpt-4o-mini)
- Hyperparameters (temperature, max_tokens)
- Feature flags
- External service URLs

**NO:**
- Prompts (those are code)
- Business logic
- Algorithm implementations

## IV. Backing Services: Treat Backing Services as Attached Resources

**AI adaptation:** **LLM providers, vector DBs, and model hosting are backing services.**

### Principle: Swappable Providers

```python
# Abstract LLM interface
class LLMProvider:
    def generate(self, prompt, **kwargs):
        raise NotImplementedError

class OpenAIProvider(LLMProvider):
    def generate(self, prompt, **kwargs):
        return openai.ChatCompletion.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            **kwargs
        )

class AnthropicProvider(LLMProvider):
    def generate(self, prompt, **kwargs):
        return anthropic.messages.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            **kwargs
        )

# Usage: swappable via config
llm = get_provider(config.LLM_PROVIDER)
response = llm.generate(prompt)
```

**Why:** Provider outages happen. Multi-provider redundancy is critical.

### Vector Database as Backing Service

```python
# Abstract vector store
class VectorStore:
    def search(self, query, k=5):
        raise NotImplementedError

# Implementations: Pinecone, Weaviate, Qdrant, etc.
# Swappable via environment config
vector_db = get_vector_store(config.VECTOR_DB_PROVIDER)
```

## V. Build, Release, Run: Strictly Separate Build and Run Stages

**AI adaptation:** **Include model evaluation in build stage.**

### Build Stage

```bash
# 1. Build: Code + dependencies + prompts
docker build -t ai-service:v1.2.3 .

# 2. Test: Unit tests + integration tests
pytest tests/

# 3. Evaluate: Run evaluation suite
python eval/run_evals.py --threshold 0.85

# 4. Release: Tag and push
docker push ai-service:v1.2.3
```

**Critical addition:** Evaluation tests before release.

### Evaluation Tests

```python
# eval/test_hallucination.py
def test_no_hallucinations():
    test_cases = load_test_cases("evals/hallucination-tests.jsonl")
    
    for case in test_cases:
        response = agent.generate(case.prompt)
        
        # Verify no hallucinated facts
        assert not contains_hallucination(response, case.known_facts)
        
        # Verify citations when required
        if case.requires_citation:
            assert has_valid_citations(response)
```

**CI/CD gate:** Evals must pass before deployment.

## VI. Processes: Execute the App as Stateless Processes

**AI adaptation:** **Conversation state belongs in backing stores, not process memory.**

### Anti-Pattern: In-Memory Conversation State

```python
# BAD: State in process memory
conversations = {}  # Lost on restart

def chat(user_id, message):
    if user_id not in conversations:
        conversations[user_id] = []
    
    conversations[user_id].append(message)
    response = agent.generate(conversations[user_id])
    conversations[user_id].append(response)
    return response
```

**Problem:** Restart loses all conversations. Can't scale horizontally.

### Good Pattern: External State Storage

```python
# GOOD: State in Redis/DB
def chat(user_id, message):
    # Load state from backing store
    history = redis.get(f"conversation:{user_id}") or []
    
    history.append({"role": "user", "content": message})
    
    response = agent.generate(history)
    
    history.append({"role": "assistant", "content": response})
    
    # Save state back
    redis.set(f"conversation:{user_id}", history, ex=3600)
    
    return response
```

**Benefit:** Stateless processes, horizontal scaling, resilient to restarts.

## VII. Port Binding: Export Services via Port Binding

**Standard principle applies.** AI service should be self-contained web service.

```python
# FastAPI example
from fastapi import FastAPI

app = FastAPI()

@app.post("/generate")
async def generate(request: GenerationRequest):
    response = agent.generate(request.prompt)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

**No special hosting required.** Just bind to a port.

## VIII. Concurrency: Scale Out via the Process Model

**AI adaptation:** **Scale workers, manage token rate limits.**

### Token Rate Limiting

```python
from redis import Redis
from time import sleep

redis = Redis()

def rate_limited_generate(prompt):
    # Token-based rate limiting (not request-based)
    estimated_tokens = estimate_tokens(prompt)
    
    # Check rate limit (e.g., 100K tokens/minute)
    current_usage = redis.get("tokens:current_minute") or 0
    
    if int(current_usage) + estimated_tokens > 100000:
        sleep(wait_time_until_next_minute())
    
    response = llm.generate(prompt)
    
    # Track usage
    redis.incrby("tokens:current_minute", estimated_tokens, ex=60)
    
    return response
```

**Critical:** Scale workers within provider rate limits.

### Horizontal Scaling Architecture

```
Load Balancer
  ↓
[Worker 1] [Worker 2] [Worker 3] ... [Worker N]
  ↓           ↓           ↓             ↓
Shared Redis (conversation state)
Shared Vector DB (knowledge base)
Shared LLM Provider (rate-limited)
```

## IX. Disposability: Maximize Robustness with Fast Startup and Graceful Shutdown

**AI adaptation:** **Warm up models/caches, drain in-progress LLM calls.**

### Fast Startup

```python
def startup():
    # Warm up connections
    llm_provider.health_check()
    vector_db.health_check()
    
    # Preload frequently-used prompts
    prompt_cache.warm_up()
    
    # Test LLM connectivity
    llm_provider.generate("test")
    
    logger.info("Service ready")

# FastAPI
@app.on_event("startup")
async def on_startup():
    startup()
```

### Graceful Shutdown

```python
def shutdown():
    # Stop accepting new requests
    server.stop_accepting_requests()
    
    # Wait for in-progress LLM calls (can take 5-10s)
    wait_for_in_progress_calls(timeout=30)
    
    # Close connections
    llm_provider.close()
    vector_db.close()
    
    logger.info("Shutdown complete")

@app.on_event("shutdown")
async def on_shutdown():
    shutdown()
```

**Critical:** LLM calls can take 5-10 seconds. Don't kill mid-request.

## X. Dev/Prod Parity: Keep Dev, Staging, and Production as Similar as Possible

**AI adaptation:** **Use same model versions across environments (but maybe different sizes).**

### Model Parity Strategy

```yaml
# Development
model:
  provider: openai
  model: gpt-4o-mini  # Cheaper for dev
  temperature: 0.0    # Same hyperparams

# Production
model:
  provider: openai
  model: gpt-4        # Better quality
  temperature: 0.0    # Same hyperparams
```

**Key:** Same prompts, same hyperparameters, similar (but not necessarily identical) models.

### Backing Service Parity

- **Dev:** Local vector DB (Docker)
- **Staging:** Cloud vector DB (small instance)
- **Prod:** Cloud vector DB (large instance)

**Same technology, different scale.**

## XI. Logs: Treat Logs as Event Streams

**AI adaptation:** **Log prompts, responses, and token usage.**

### Comprehensive AI Logging

```python
import structlog

logger = structlog.get_logger()

def generate_with_logging(prompt, metadata=None):
    request_id = uuid.uuid4()
    
    logger.info("llm_request",
        request_id=request_id,
        prompt_hash=hash(prompt),
        prompt_length=len(prompt),
        model=config.MODEL,
        metadata=metadata
    )
    
    start_time = time.time()
    
    try:
        response = llm.generate(prompt)
        
        logger.info("llm_response",
            request_id=request_id,
            response_length=len(response),
            latency_ms=(time.time() - start_time) * 1000,
            tokens_used=estimate_tokens(prompt + response),
            success=True
        )
        
        return response
        
    except Exception as e:
        logger.error("llm_error",
            request_id=request_id,
            error=str(e),
            latency_ms=(time.time() - start_time) * 1000
        )
        raise
```

**Stream to centralized logging:** Datadog, Splunk, ELK, etc.

## XII. Admin Processes: Run Admin/Management Tasks as One-Off Processes

**AI adaptation:** **Batch operations for embeddings, reindexing, model evaluations.**

### Examples of Admin Processes

```bash
# Generate embeddings for new documents
python admin/generate_embeddings.py --input docs/*.pdf

# Reindex vector database
python admin/reindex_vector_db.py --source s3://docs/

# Run evaluation suite
python admin/run_evals.py --suite production_tests

# Analyze token usage
python admin/analyze_costs.py --date 2026-02-01
```

**Run as one-off scripts, not part of main service.**

## Bonus Factor XIII: Monitoring & Observability (AI-Specific)

**New for AI:** Monitor quality, not just uptime.

### Key Metrics

**Quality Metrics:**
- Hallucination rate
- Citation accuracy
- User satisfaction (thumbs up/down)
- Human override rate

**Performance Metrics:**
- Latency (p50, p95, p99)
- Token usage per request
- Cost per request
- Error rate

**Operational Metrics:**
- Provider API errors
- Rate limit hits
- Cache hit rate

### Observability Dashboard

```python
# Prometheus metrics
from prometheus_client import Counter, Histogram

llm_requests = Counter('llm_requests_total', 'Total LLM requests')
llm_errors = Counter('llm_errors_total', 'Total LLM errors')
llm_latency = Histogram('llm_latency_seconds', 'LLM request latency')
llm_tokens = Histogram('llm_tokens_used', 'Tokens used per request')

def monitored_generate(prompt):
    llm_requests.inc()
    
    with llm_latency.time():
        try:
            response = llm.generate(prompt)
            llm_tokens.observe(estimate_tokens(prompt + response))
            return response
        except Exception as e:
            llm_errors.inc()
            raise
```

## The Bottom Line

**The 12-Factor methodology still applies to AI services—with adaptations:**

1. **Version control prompts** (they're code)
2. **Pin model versions** (behavior changes)
3. **Environment config** (not prompts)
4. **Swappable LLM providers** (backing services)
5. **Evaluate before deploy** (build stage)
6. **External conversation state** (stateless processes)
7. **Standard port binding** (unchanged)
8. **Token rate limiting** (concurrency)
9. **Graceful LLM drain** (disposability)
10. **Model parity** (dev/prod)
11. **Log prompts & tokens** (event streams)
12. **Batch operations** (admin processes)
13. **Monitor quality** (observability)

**Build production AI services that scale, cost-optimize, and stay reliable.**

---

## Take Action

1. **Download our [12-Factor AI Checklist](#)** - Audit your AI service
2. **Get our [Production AI Starter Template](#)** - Boilerplate with all 12 factors
3. **Book a free architecture review** - We'll identify gaps in your setup

Build AI services the right way from day one.

**Let's build production-grade AI together.**
