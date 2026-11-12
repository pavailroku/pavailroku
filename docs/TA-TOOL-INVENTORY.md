# TA tool inventory answers

Copy-paste into the form. DRI: Pavail Aqeel.

1. **Tool name**  
   Roku Talent Intelligence

2. **Link**  
   Live demo (while the cloud agent is up): see the trycloudflare URL in the latest message.  
   GitHub: https://github.com/pavailroku/pavailroku  
   GitLab: https://gitlab.eng.roku.com/paqeel/roku-talent-intelligence-engine  
   App path: `/` (chat). Weekly pulse: `/reports/weekly`.

3. **Creator / DRI**  
   Pavail Aqeel, Sr Technical Recruiter (Cambridge & Manchester), paqeel@roku.com

4. **Type**  
   Standalone app

5. **What is it?**  
   A live chat that tells hiring managers and recruiters where a req should live, what the budget is worth there, and when the person can start — using cited market data, not a candidate database.

6. **Stage of the hiring lifecycle**  
   Headcount / location planning, req intake, recruiter market pulse (pre-sourcing). Not screening, not offer, not onboarding.

7. **How is it used today?**  
   Pilot. Pavail runs it for UK (Cambridge, Manchester) and US desks in demos with TA and engineering leadership. Hiring managers type a role + budget; recruiters type “weekly digest”.

8. **Number of active users**  
   ~1 builder + leadership demo audience (pilot, not production roll-out).

9. **Status**  
   Pilot

10. **Benefit**  
    One 30-second typed question replaces a scavenger hunt across LinkedIn TI, news, and spreadsheets. Example (12 Nov 2026): UK Senior SWE £90k → Manchester recommended (£90k vs ~£82k local market, COL 96, P50 12 Mar 2027); London flagged below market (~£115k). Digest kept 1 Qualcomm event for Cambridge desks, dropped 7 off-desk items.

11. **Risk**  
    Does not write to Greenhouse or touch candidate PII. Optional Glean/Confluence for internal org (named people only when connected; otherwise Demo). Public layoff feeds (Talent Risk, layoffs.uk). Accuracy: numbers are computed in code; invented layoffs/dates are withheld. Bias: we score locations and money, not people. GDPR: internal names stay internal. Human still signs the req.

12. **Human review before output is used?**  
    Yes

13. **Describe the human review**  
    The app recommends. The hiring manager, recruiter, and finance/engineering partners still approve location, budget, and start. Quiet digest weeks are still read by TA, not auto-actioned into outreach.

14. **Scalable?**  
    New user: open the URL, type. No LinkedIn license required. Optional: Glean token on Roku network, Adzuna keys, Resend for email. Maintained by Pavail (DRI) with GitHub/GitLab CI tests.

15. **Overlap**  
    Deliberately does **not** overlap Juicebox, LinkedIn Recruiter, or Greenhouse. Adjacent to (not replacing) LinkedIn Talent Insights exports — those are optional paste-ins.

16. **To take it further**  
    Glean on the corporate network, read-only Greenhouse time-to-fill, a stable internal host (not a quick tunnel), weekly Resend to UK/US recruiter inboxes, more Adzuna coverage.

17. **Token / $$$ cost of 1 task**  
    Scoring is local TypeScript + free public feeds (Talent Risk, layoffs.uk, published ONS/BEA tables). Marginal $ ≈ $0 per briefing today. Optional LLM narration later would be cents, not dollars. Email via Resend is their free/cheap tier if enabled.
