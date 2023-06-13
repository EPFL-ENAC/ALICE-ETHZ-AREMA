function (doc) {
  // retrieve only fields necessary for listing professionals
  if(doc.data && doc.data.type === 'technicalConstruction') {
    emit(doc._id);
  }

}