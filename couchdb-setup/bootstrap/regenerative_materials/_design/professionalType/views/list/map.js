function (doc) {
  // retrieve only fields necessary for listing professionals
  if(doc.data && doc.data.type === 'professional') {
    emit(doc._id, {
      name: doc.name,
    });
  }

}