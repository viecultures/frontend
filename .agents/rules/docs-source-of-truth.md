# Rule: Documentation is the Single Source of Truth (SSOT)

## 1. Core Principle
* The `document/` repository (or root `document/`) is the highest and only Source of Truth for frontend UI screens, user journeys, and feature behaviors.
* **Every UI screen or interaction change must be verified against documentation before implementation.**
* Agents and engineers must NEVER invent undocumented UI flows, badges, or states.

## 2. Decision Tree When Frontend Changes Are Requested

```
                 Incoming Request / Code Change
                               │
            Is it already defined in `document/`?
                               │
                ┌──────────────┴──────────────┐
               YES                            NO
                │                              │
         Proceed to Code          Is the request direct & clear?
                                               │
                                 ┌─────────────┴─────────────┐
                                YES                          NO
                                 │                           │
                          1. Update `document/`       1. STOP & Ask User
                          2. Then write code             (provide proposals)
                                                      2. Wait for confirmation
                                                      3. Update `document/`
                                                      4. Then write code
```
