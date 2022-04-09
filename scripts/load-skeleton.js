function loadSkeleton(title, backDestination) {
    $('#navPlaceholder').load('../skeletons/nav.html', () => {
        $('#page-title').html(title);
        $('#back-button').attr('href', backDestination);
    });
    console.log('Skeleton loaded');
}