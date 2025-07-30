## States

Each document (resource, building material, etc.) can have one of the following states:

| State            | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| **Draft**        | The document is being added or edited and is not yet ready for review.                     |
| **In Review**    | The document is ready for review by a reviewer.                                            |
| **To Publish**   | The document has been reviewed and approved for publication by a reviewer.                 |
| **To Unpublish** | The document is currently published and needs to be unpublished by an administrator.       |
| **To Delete**    | The document is marked for deletion by an administrator.                                   |
| **Locked**       | The document is locked by an administrator and cannot be edited, (un)published or deleted. |

## Roles

The publication flow involves different roles, each with specific permissions:

| Role              | Permissions                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| **Contributor**   | Can add and edit their own documents.                                        |
| **Reviewer**      | Can add and edit all documents but cannot (un)publish, or delete them.       |
| **Administrator** | Can perform all operations, including document (un)publication and deletion. |

## Transitions

The following diagram illustrates the publication flow for documents and the different role responsibilities:

![AREMA Publication Flow](images/arema-publication-flow.png 'AREMA Publication Flow')
