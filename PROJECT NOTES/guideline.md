Firebase JSON design: 
    -Denormalize Data: Firestore is a NoSQL database, so denormalizing your data can help reduce the number of reads and improve performance. This means duplicating data where necessary to avoid complex queries.
    -Use Subcollections: Organize related data into subcollections to make it easier to fetch related documents.
    -Use Document References: Store references to other documents to avoid duplicating large amounts of data.
    -Indexing: Ensure that you have proper indexing on fields that you frequently query.


Document access: ACL via firebase custom claim or in document
    fetching using user's docIds array: large number of concurrent request if this is large
    fetching using doc's ownerId or accessList: easier and faster, but a lot of data management

When creating, only create the bare minimum



