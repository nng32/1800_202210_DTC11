function loadSkeleton(title, backDestination) {
    $('#navPlaceholder').load('../skeletons/nav.html', () => {
        $('#page-title').html(title);
        $('#back-button').attr('href', backDestination);
    });

    $('#footerPlaceholder').load('../skeletons/footer.html', () => {

    });
    console.log('Skeleton loaded');
}