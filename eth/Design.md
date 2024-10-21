# Comedy Clash Smart Contract Design
====================================


## State vars

- address manager
- timestamp showtime
- closed

- Array of Submission // Should be an array for ability to iterate
- uint submissionCount

- mapping of submissions to a mapping of their voters

## Submissions
- address artist
- string name
- string topic
- string preview
- mapping Votings // performant lockups on voter's address; // could be privat?
- array Voting // iteration over voting details
- uint votingCount;

- uint averageTotal // could be privat?
- uint averageCount // could be privat?

# Voting

- string voter // nick anme; limited to 10 chars
- string comment // limited to 15 chars
- uint8 value [1..5]

## functions

### Comedy Clash open for submissions?
IsOpenForSubmission() // is this needed?

### Close the submission window
closeSubmissions()

- only the owner can close the submission period

### createSubmissions(string name, string topic, string preview)
- checks if the submission window is still open:
    - we are still one day before the show. 
    - if the second is not the case, the closed flag will be set to true
      and a error event SubmissionFailedEvent emitted
    
- creates a submission with given content and adds it to the list of submissions

### Create new voting
createVotingForSubmission(uint index, string voter, string comment, uint8 value)

- checks if the submission window is still open
- checks if the sender does not vote on his own submission
- checks that the sender haven't voted yet on given submission
- adds the voting to the submission 
- updates average total and count

### voting count for submission
getVotingForSubmission(uint index) 
- calculates the average voting for the given submission


