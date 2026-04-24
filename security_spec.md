# Security Specification - DoaçãoViva

## Data Invariants
1. A **Story** must have a valid `authorId` that matches the authenticated user.
2. A **Donation** must reference an existing story and have a `donorId` matching the authenticated user (unless anonymous, which we'll handle by requiring the authenticated ID to be stored even if not displayed).
3. **User Profiles** can only be created/edited by the respective user.
4. **raisedAmount** in a Story should only be incremented when a donation is made (atomicity check if possible, or restricted update).
5. **PII (email)** in `/users/{userId}/private/info` must only be readable by the owner.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Attempt to create a story with `authorId` = "some_other_user".
2. **PII Leak**: Authenticated User A attempts to read User B's `/private/info`.
3. **Resource Poisoning**: Create a Story with a 2MB content string.
4. **State Shortcutting**: Update a Story's `status` to 'active' after it has been 'completed'.
5. **Invalid Pix Key**: Create a Story with a Pix key longer than 256 characters.
6. **Self-Promotion**: Authenticated User A tries to edit User B's public profile.
7. **Phantom Donation**: Create a Donation for a story that doesn't exist.
8. **Amount Tampering**: Update `raisedAmount` directly without a donation record.
9. **Negative Donation**: Create a Donation with `amount` = -100.
10. **ID Injection**: Create a Story with a document ID containing special characters like `../`.
11. **Immutability Breach**: Attempt to change `createdAt` on an existing Story.
12. **Unverified Write**: Attempt to write data from an unverified email account (if email_verified check is active).

## Test Runner (Logic Overview)
The `firestore.rules` will be tested against these scenarios to ensure `PERMISSION_DENIED` is returned for all malicious attempts.
