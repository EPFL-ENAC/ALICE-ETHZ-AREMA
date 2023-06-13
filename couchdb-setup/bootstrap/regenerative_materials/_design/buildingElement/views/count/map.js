function (doc) {
  // retrieve only fields necessary for listing professionals
  if(doc.data && doc.data.type === 'buildingElement') {
    emit(doc._id);
  }

}