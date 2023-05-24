function (doc) {
  // retrieve only fields necessary for listing professionals
  if(doc.type === 'professional') {
    emit(doc._id, {
      name: doc.name,
    });
  }
}