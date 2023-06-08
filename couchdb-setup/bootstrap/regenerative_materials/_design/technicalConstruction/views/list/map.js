function (doc) {
  // retrieve only fields necessary for listing technicalConstructions
  if(doc.data && doc.data.type === 'technicalConstruction') {
    emit(doc._id, {
      name: doc.name,
    });
  }

}