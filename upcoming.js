(function () {
    'use strict';

    const API = '/Upcoming';

    function getItemId() {
        const match = window.location.pathname.match(
            /\/details\/([0-9a-f-]{36})/i
        );

        return match ? match[1] : null;
    }

    async function getUpcoming(itemId) {
        const response = await ApiClient.fetch({
            url: `${ApiClient.getUrl()}${API}/${itemId}`,
            type: 'GET',
            dataType: 'json'
        });

        if (response.status === 404) {
            return null;
        }

        return response.json();
    }

    async function saveUpcoming(data) {
        return ApiClient.fetch({
            url: `${ApiClient.getUrl()}${API}`,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        });
    }

    function createButton(text, callback) {
        const button = document.createElement('button');

        button.className =
            'raised emby-button upcoming-button';

        button.textContent = text;

        button.addEventListener('click', callback);

        return button;
    }

    async function init() {
        const itemId = getItemId();

        if (!itemId)
            return;

        const upcoming = await getUpcoming(itemId);

        if (upcoming) {
            renderUpcoming(upcoming);
        } else {
            renderMarkButton(itemId);
        }
    }

    function renderMarkButton(itemId) {
        const button = createButton(
            '🔒 Marcar como próximamente',
            () => openUpcomingDialog(itemId)
        );

        const target = document.querySelector(
            '.detailButtons'
        );

        if (target) {
            target.appendChild(button);
        }
    }

    function renderUpcoming(data) {
        console.log(
            '[Upcoming] Upcoming item:',
            data
        );

        addUpcomingBadge(data);
        addCountdown(data);
        blockPlayback(data);
    }

    function addUpcomingBadge(data) {
        const title = document.querySelector(
            '.itemName'
        );

        if (!title)
            return;

        const badge = document.createElement('div');

        badge.className =
            'upcoming-badge';

        badge.textContent =
            '🔒 PRÓXIMAMENTE';

        title.parentElement?.appendChild(badge);
    }

    function addCountdown(data) {
        if (!data.showCountdown)
            return;

        const title = document.querySelector(
            '.itemName'
        );

        if (!title)
            return;

        const countdown =
            document.createElement('div');

        countdown.className =
            'upcoming-countdown';

        title.parentElement?.appendChild(
            countdown
        );

        function update() {
            const target =
                new Date(data.releaseDate);

            const diff =
                target.getTime() -
                Date.now();

            if (diff <= 0) {
                countdown.textContent =
                    '🎉 YA DISPONIBLE';

                return;
            }

            const days =
                Math.floor(
                    diff /
                    86400000
                );

            const hours =
                Math.floor(
                    diff /
                    3600000
                ) % 24;

            countdown.textContent =
                `Faltan ${days} días y ${hours} horas`;
        }

        update();

        setInterval(update, 60000);
    }

    function blockPlayback(data) {
        if (!data.blockPlayback)
            return;

        document.addEventListener(
            'click',
            function (event) {
                const button =
                    event.target.closest(
                        'button'
                    );

                if (!button)
                    return;

                const text =
                    button.textContent
                        ?.toLowerCase();

                if (
                    text?.includes('play') ||
                    text?.includes('reproducir')
                ) {
                    event.preventDefault();
                    event.stopPropagation();

                    alert(
                        '🔒 Esta película todavía no está disponible.'
                    );
                }
            },
            true
        );
    }

    function openUpcomingDialog(itemId) {
        const date =
            prompt(
                'Fecha de estreno (YYYY-MM-DD):'
            );

        if (!date)
            return;

        saveUpcoming({
            itemId: itemId,
            upcoming: true,
            releaseDate:
                `${date}T00:00:00`,
            showCountdown: true,
            blockPlayback: true,
            showInUpcoming: true
        })
        .then(() => {
            location.reload();
        });
    }

    let lastUrl = location.href;

    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 500);
        }
    }, 500);

    init();

})();
