function (newDoc, oldDoc, userCtx) {
    return;
}

// for an CREATE -> argument oldDoc === null
// for an UPDATE -> newDoc and OldDoc exist and _deleted does not
// for an DELETE -> field '_deleted' présent dans newDoc
// for an READ -> we don't go through this function