function (doc) {
  // retrieve only fields necessary for listing professionals
  if(doc.data && doc.data.type === 'naturalResource') {
    emit(doc._id);
  }

}