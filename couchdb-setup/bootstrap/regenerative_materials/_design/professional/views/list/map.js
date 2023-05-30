function (doc) {
  // retrieve only fields necessary for listing naturalResources
  if(doc.data && doc.data.type === 'professional') {
    emit(doc._id, {
      name: doc.name,
    });
  }

}