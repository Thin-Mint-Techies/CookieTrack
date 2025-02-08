Firebase JSON design: 
    -Denormalize Data: Firestore is a NoSQL database, so denormalizing your data can help reduce the number of reads and improve performance. This means duplicating data where necessary to avoid complex queries.
    -Use Subcollections: Organize related data into subcollections to make it easier to fetch related documents.
    -Use Document References: Store references to other documents to avoid duplicating large amounts of data.
    -Indexing: Ensure that you have proper indexing on fields that you frequently query.