Bug 1: Memory Leak - Missing Interval Cleanup

Issues Found

1. The interval for refreshing data was not cleared when the component unmounts.
2. There was no cleanup mechanism for the interval, leading to multiple intervals stacking up.

Impact

-   Memory leaks occur because the interval keeps running even after the component is unmounted.
-   API calls continue in the background even after navigating away from the page, causing unnecessary server load.
-   Multiple intervals can stack up if the component remounts, causing performance degradation and slowdowns.

    Root Cause

The interval was set up in the `useEffect` hook but was not cleaned up when the component unmounted or when dependencies changed.

==============

Bug 2: Missing Dependency - `refreshInterval`

Issues Found

1. The `refreshInterval` was not included in the dependency array of the `useEffect` hook.
2. The effect didn't rerun when the `refreshInterval` prop changed.

Impact

-   If `refreshInterval` changes, the existing interval continues with the old value.
-   New intervals are not created with the updated `refreshInterval`, leading to stale behavior.
-   The `refreshInterval` value in the interval function may be outdated.

    Root Cause

The `refreshInterval` was missing from the `useEffect` dependency array, which caused the effect to not respond to changes in this prop.

==============

Bug 3: Performance Issue - NumberFormat Recreation

Issues Found

1. A new instance of `Intl.NumberFormat` was created on every render.
2. Formatting logic was run every time the component re-renders.

Impact

-   Recreating the `Intl.NumberFormat` object on each render is expensive.
-   If there are many items to render (e.g., 100 transactions), creating new formatters on each render leads to performance problems.
-   Frequent re-renders (like typing in the search bar) result in lag and dropped frames.

    Root Cause

The `Intl.NumberFormat` was created inside the `formatAmount` function, which was being called on every render, causing unnecessary performance overhead.

==============

Bug 4: No Error Handling

Issues Found

1. The code did not handle API errors.
2. If the API call failed, there was no error message shown to the user.

Impact

-   Users were left with no feedback when an API call failed, resulting in a poor user experience.
-   No retry mechanism was in place, leaving users stranded with a blank page.
-   The error was silently logged to the console without notifying the user.

    Root Cause

Error handling was not implemented for the API request, and no fallback or error message was displayed when the request failed.

==============

Bug 5: No Loading State

Issues Found

1. There was no indication of loading while data was being fetched.
2. The table displayed empty data without informing the user that data is being loaded.

Impact

-   Users didn’t know if the data was still loading or if there were no results.
-   This caused confusion about whether the request was successful or the data was simply unavailable.
-   Overall, it led to a poor user experience when waiting for the data.

    Root Cause

The component did not manage or display a loading state while the data was being fetched.

==============

Bug 6: Unnecessary State - `filteredTransactions`

Issues Found

1. `filteredTransactions` was stored in state instead of being derived from `transactions`.
2. A `useEffect` hook was used to filter the transactions, which resulted in unnecessary state management.

Impact

-   Storing the filtered transactions in state added unnecessary complexity.
-   Every time the `searchTerm` or `transactions` changed, `filteredTransactions` had to be updated, causing unnecessary re-renders.
-   This also made the code harder to maintain and debug.

    Root Cause

Filtered transactions were unnecessarily stored in state instead of being computed on-the-fly based on the current data.
