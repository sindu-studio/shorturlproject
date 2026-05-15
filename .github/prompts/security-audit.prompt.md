---
agent: Ask
---

Perform a security audit of the codebase. Identify potential vulnerabilities, security risks, and areas for improvement. Provide recommendations for enhancing the security posture of the application. If you need more information about the codebase or specific areas to focus on, please ask for clarification. Outoutput your findings as a markdown formatted table with the following columns ("ID" should start at 1 and auto increment, File Path should be an actual link to the file):"ID",""Severity","Issue","File Path","Line Number(s), "Reccomendation".

Next, ask the user which sissues they want to fix by either replying "all", or a comma separated list of IDs. After thier reply, run a separate subagent(#runsubagent) to fix each issue specified. Each subagent should report back with a simple `subagentSuccess:true| false`.