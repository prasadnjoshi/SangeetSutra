
document.addEventListener("DOMContentLoaded", async () => {

    const gallery = document.getElementById("event-gallery");

    if (!gallery) {
        console.error("Gallery container not found.");
        return;
    }

    // Available gallery categories
    const availableCategories = [
        "wedding",
        "sangeet",
        "engagement",
        "reception",
        "corporate"
    ];

    // Gallery styling
    const style = document.createElement("style");

    style.textContent = `
        .event-category-filters {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 30px;
        }

        .event-category-button {
            background: transparent;
            border: 1px solid rgba(200,162,75,.5);
            color: #c8a24b;
            padding: 10px 24px;
            border-radius: 25px;
            font-size: 14px;
            cursor: pointer;
            transition: all .3s ease;
            text-transform: capitalize;
        }

        .event-category-button:hover,
        .event-category-button.active {
            background: #c8a24b;
            color: #111;
        }

        .event-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 24px;
        }

        .event-card {
            cursor: pointer;
            overflow: hidden;
            border-radius: 12px;
            background: #171717;
            border: 1px solid rgba(200,162,75,.3);
        }

        .event-card-media {
            position: relative;
            overflow: hidden;
        }

        .event-card img {
            width: 100%;
            max-width: 100%;
            height: 260px;
            object-fit: cover;
            display: block;
            transition: transform .4s ease;
            box-sizing: border-box;
        }

        .event-card:hover img {
            transform: scale(1.05);
        }

        .event-video-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 58px;
            height: 58px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,.7);
            border: 2px solid #c8a24b;
            border-radius: 50%;
            color: #c8a24b;
            font-size: 25px;
            padding-left: 4px;
            pointer-events: none;
        }

        .event-card-title {
            padding: 16px;
            color: #c8a24b;
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            text-align: center;
        }

        .event-gallery-modal {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: rgba(0,0,0,.96);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .event-gallery-modal.active {
            display: flex;
        }

        .event-viewer {
            width: 100%;
            max-width: 1200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        .event-modal-header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .event-modal-title {
            color: #c8a24b;
            font-size: 26px;
            font-family: 'Playfair Display', serif;
        }

        .event-modal-close {
            background: transparent;
            border: 1px solid #c8a24b;
            color: #c8a24b;
            font-size: 28px;
            cursor: pointer;
            width: 42px;
            height: 42px;
            border-radius: 50%;
        }

        .event-viewer-content {
            width: 100%;
            height: 75vh;
            display: flex;
            justify-content: center;
            align-items: center;
            touch-action: pan-y;
        }

        .event-viewer-content img,
        .event-viewer-content video {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }

        .event-viewer-navigation {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 25px;
        }

        .event-nav-button {
            background: transparent;
            border: 1px solid #c8a24b;
            color: #c8a24b;
            padding: 10px 22px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
        }

        .event-nav-button:hover,
        .event-modal-close:hover {
            background: #c8a24b;
            color: #111;
        }

        .event-nav-button:disabled {
            opacity: .35;
            cursor: not-allowed;
        }

        .event-media-counter {
            color: #fff;
            font-size: 14px;
        }

        .event-gallery-message {
            color: #c8a24b;
            text-align: center;
            padding: 30px 10px;
        }

        @media (max-width: 600px) {

            .event-category-filters {
                gap: 8px;
                margin-bottom: 22px;
            }

            .event-category-button {
                padding: 8px 16px;
                font-size: 13px;
            }

            .event-card img {
                height: 220px;
            }

            .event-video-indicator {
                width: 48px;
                height: 48px;
                font-size: 21px;
            }

            .event-viewer-content {
                height: 65vh;
            }

            .event-modal-title {
                font-size: 20px;
            }

            .event-nav-button {
                padding: 9px 16px;
            }
        }
    `;

    document.head.appendChild(style);

    gallery.classList.add("event-gallery-grid");

    // Create category filter container
    const categoryFilters = document.createElement("div");
    categoryFilters.className = "event-category-filters";

    gallery.parentNode.insertBefore(categoryFilters, gallery);

    // Create image viewer popup
    const modal = document.createElement("div");
    modal.className = "event-gallery-modal";

    modal.innerHTML = `
        <div class="event-viewer">

            <div class="event-modal-header">
                <div class="event-modal-title"></div>

                <button class="event-modal-close"
                        aria-label="Close gallery">
                    &times;
                </button>
            </div>

            <div class="event-viewer-content"></div>

            <div class="event-viewer-navigation">
                <button class="event-nav-button previous-button">
                    &#10094; Previous
                </button>

                <span class="event-media-counter"></span>

                <button class="event-nav-button next-button">
                    Next &#10095;
                </button>
            </div>

        </div>
    `;

    document.body.appendChild(modal);

    const modalTitle = modal.querySelector(".event-modal-title");
    const viewerContent = modal.querySelector(".event-viewer-content");
    const closeButton = modal.querySelector(".event-modal-close");
    const previousButton = modal.querySelector(".previous-button");
    const nextButton = modal.querySelector(".next-button");
    const mediaCounter = modal.querySelector(".event-media-counter");

    let currentEvent = null;
    let currentIndex = 0;
    let allEvents = [];
    let activeCategory = "all";

    // Display current image or video
    function showMedia(index) {

        if (!currentEvent || !currentEvent.media.length) {
            return;
        }

        if (index < 0 || index >= currentEvent.media.length) {
            return;
        }

        // Stop previously playing video
        viewerContent.querySelectorAll("video").forEach(video => {
            video.pause();
            video.removeAttribute("src");
            video.load();
        });

        currentIndex = index;

        viewerContent.replaceChildren();

        const item = currentEvent.media[currentIndex];

        let element;

        if (item.type === "image") {

            element = document.createElement("img");
            element.src = item.url;
            element.alt = item.name || currentEvent.title;

        } else if (item.type === "video") {

            element = document.createElement("video");
            element.src = item.url;
            element.controls = true;
            element.preload = "metadata";
            element.playsInline = true;

        } else {
            return;
        }

        viewerContent.appendChild(element);

        previousButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === currentEvent.media.length - 1;

        mediaCounter.textContent =
            `${currentIndex + 1} / ${currentEvent.media.length}`;
    }

    // Open event viewer
    function openGallery(event) {

        if (!Array.isArray(event.media) || event.media.length === 0) {
            console.error("No media available for:", event.title);
            return;
        }

        currentEvent = event;

        modalTitle.textContent = event.title;

        showMedia(0);

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    // Previous media
    previousButton.addEventListener("click", () => {
        showMedia(currentIndex - 1);
    });

    // Next media
    nextButton.addEventListener("click", () => {
        showMedia(currentIndex + 1);
    });

    // Mobile swipe navigation
    let touchStartX = 0;
    let touchStartY = 0;

    viewerContent.addEventListener("touchstart", event => {

        // Do not interfere with video controls
        if (event.target.closest("video")) {
            return;
        }

        const touch = event.changedTouches[0];

        touchStartX = touch.screenX;
        touchStartY = touch.screenY;

    }, { passive: true });

    viewerContent.addEventListener("touchend", event => {

        // Do not interfere with video controls
        if (event.target.closest("video")) {
            return;
        }

        const touch = event.changedTouches[0];

        const differenceX = touch.screenX - touchStartX;
        const differenceY = touch.screenY - touchStartY;

        // Ignore short or mostly vertical movements
        if (
            Math.abs(differenceX) < 50 ||
            Math.abs(differenceX) < Math.abs(differenceY)
        ) {
            return;
        }

        if (differenceX < 0) {

            // Swipe left: Next media
            showMedia(currentIndex + 1);

        } else {

            // Swipe right: Previous media
            showMedia(currentIndex - 1);
        }

    }, { passive: true });

    // Close viewer
    function closeGallery() {

        modal.classList.remove("active");

        viewerContent.querySelectorAll("video").forEach(video => {
            video.pause();
            video.removeAttribute("src");
            video.load();
        });

        viewerContent.replaceChildren();

        currentEvent = null;

        document.body.style.overflow = "";
    }

    closeButton.addEventListener("click", closeGallery);

    // Close when clicking outside viewer
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeGallery();
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", event => {

        if (!modal.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {
            closeGallery();
        }

        if (event.key === "ArrowLeft") {
            showMedia(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            showMedia(currentIndex + 1);
        }
    });

    // Render event cards based on selected category
    function renderEvents() {

        gallery.replaceChildren();

        const filteredEvents = activeCategory === "all"
            ? allEvents
            : allEvents.filter(event =>
                (event.category || "").trim().toLowerCase() === activeCategory
            );

        if (filteredEvents.length === 0) {

            gallery.innerHTML =
                '<p class="event-gallery-message">No events available in this category.</p>';

            return;
        }

        filteredEvents.forEach(event => {

            const card = document.createElement("div");
            card.className = "event-card";

            const mediaContainer = document.createElement("div");
            mediaContainer.className = "event-card-media";

            const image = document.createElement("img");

            image.src = event.thumbnail;
            image.alt = event.title;
            image.loading = "lazy";
            image.decoding = "async";

            // Display fallback if thumbnail is missing
            image.onerror = function () {
                this.onerror = null;
                this.src = "images/SangeetSutraThumbnail.png";
            };

            mediaContainer.appendChild(image);

            // Show play icon if event contains a video
            const hasVideo = Array.isArray(event.media) &&
                event.media.some(item => item.type === "video");

            if (hasVideo) {

                const playIndicator = document.createElement("span");

                playIndicator.className = "event-video-indicator";
                playIndicator.textContent = "▶";
                playIndicator.setAttribute("aria-label", "Contains video");

                mediaContainer.appendChild(playIndicator);
            }

            const title = document.createElement("div");
            title.className = "event-card-title";
            title.textContent = event.title;

            card.append(mediaContainer, title);

            card.addEventListener("click", () => {
                openGallery(event);
            });

            gallery.appendChild(card);
        });
    }

    // Create category filter buttons
    function renderCategoryFilters() {

        categoryFilters.replaceChildren();

        const existingCategories = availableCategories.filter(category =>
            allEvents.some(event =>
                (event.category || "").trim().toLowerCase() === category
            )
        );

        const categories = ["all", ...existingCategories];

        categories.forEach(category => {

            const button = document.createElement("button");

            button.type = "button";
            button.className = "event-category-button";

            button.textContent =
                category === "all"
                    ? "All"
                    : category.charAt(0).toUpperCase() + category.slice(1);

            if (activeCategory === category) {
                button.classList.add("active");
            }

            button.addEventListener("click", () => {

                activeCategory = category;

                renderCategoryFilters();
                renderEvents();
            });

            categoryFilters.appendChild(button);
        });
    }

    // Load events from JSON
    async function loadEvents() {

        gallery.innerHTML =
            '<p class="event-gallery-message">Loading events...</p>';

        try {

            const response = await fetch(
                "data/events.json",
                { cache: "no-store" }
            );

            if (!response.ok) {
                throw new Error("Unable to load events.json");
            }

            const events = await response.json();

            if (!Array.isArray(events) || events.length === 0) {

                gallery.innerHTML =
                    '<p class="event-gallery-message">No events available yet.</p>';

                categoryFilters.replaceChildren();

                return;
            }

            allEvents = events;

            activeCategory = "all";

            renderCategoryFilters();
            renderEvents();

        } catch (error) {

            console.error("Gallery loading error:", error);

            gallery.innerHTML =
                '<p class="event-gallery-message">Unable to load events. Please try again later.</p>';

            categoryFilters.replaceChildren();
        }
    }

    await loadEvents();

});
