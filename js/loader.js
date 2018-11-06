$(function() {

    var navbar = `
    <!-- Navbar loaded from loader.js -->
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
        <a class="navbar-brand" href="./index.html">MATLAB Tutorial</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbar">
            <ul class=" navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="./index.html">Home <span class="sr-only">(current)</span></a>
                </li>
                <!-- <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li> -->

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navdropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Problems</a>
                    <div class="dropdown-menu" aria-labelledby="dropdown03">
                        <a class="dropdown-item" href="./entry.html?p=basics">Basics</a>
                        <a class="dropdown-item" href="./entry.html?p=circuit">Circuit</a>
                        <!-- <a class="dropdown-item" href="./entry.html?p=population">Population Dynamics</a> -->
                    </div>
                </li>
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a id="buildNo" class="nav-link">v1.1</a>
                </li>
            </ul>
        </div>
    </nav>
    `;


    function loadNavBar() {
        $('.navbar-container').html(navbar);
    }


    loadNavBar();
})
