function (doc) {
  // retrieve only fields necessary for listing naturalResources
  if(doc.type === 'natural_resource') {
    emit(doc._id, {
      name: doc.name,
    });
  }

}