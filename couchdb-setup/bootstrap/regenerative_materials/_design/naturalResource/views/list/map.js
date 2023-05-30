function (doc) {
  // retrieve only fields necessary for listing naturalResources
  if(doc.data && doc.data.type === 'naturalResource') {
    emit(doc._id, {
      name: doc.name,
    });
  }

}