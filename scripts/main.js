function storeEventData(id) {
    localStorage.setItem("eventID", id);
    console.log(`Data for ${id} has been stored.`)
}