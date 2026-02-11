# Email 2: Common Mistake + Education

**Subject:** Common mistake: Why most AI projects fail

---

Hi {First_Name},

I review a lot of AI systems. Most have the same problem:

**They treat LLMs like deterministic code.**

**Example:**

Team builds customer support agent. Works great in testing.

Deploy to prod. Within 24 hours:
- Hallucinating refund policies
- Making up tracking numbers
- Confidently wrong 8% of the time

**What went wrong?**

They built it like traditional code:
- Input → LLM → Output → User
- No validation
- No confidence checking
- No human-in-loop for high-risk actions

**This always fails in production.**

**What works:**

5-layer defense:
1. Constrain inputs (structure before LLM)
2. Ground in verified data (RAG done right)
3. Score confidence (know when you don't know)
4. Validate outputs (catch hallucinations)
5. Human-in-loop (for high-stakes)

**Result:** Hallucination rate drops from 8% to <0.5%.

**Your system:**

Where are you on this spectrum?

Reply and tell me your biggest AI architecture challenge. I'll send specific advice.

— Oliver

P.S. Next: Architecture patterns that cut latency 10x.
