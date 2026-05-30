
document.addEventListener('DOMContentLoaded', function () {
	const projects = document.querySelectorAll('.blender-project .media-row');

	projects.forEach(row => {
		const imageBlock = row.querySelector('.media-block img')?.closest('.media-block');
		const iframeBlock = row.querySelector('.media-block iframe')?.closest('.media-block');

		if (imageBlock && iframeBlock) {
			const iframe = iframeBlock.querySelector('iframe');
			const ytSrc = iframe?.getAttribute('src');
			iframeBlock.style.display = 'none';
			row.classList.add('single-media');

			if (ytSrc) {
				const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

				const btn = document.createElement('button');
				btn.className = 'watch-video-btn';
				btn.type = 'button';
				btn.setAttribute('aria-label', 'Watch video');
				btn.innerHTML = '<span class="watch-video-btn__icon" aria-hidden="true">▶</span><span class="watch-video-btn__label">Watch video</span>';

				imageBlock.appendChild(btn);

				btn.addEventListener('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					openVideoModal(ytSrc);
				});

				const anchor = imageBlock.querySelector('a');
				if (anchor) {
					const currentTitle = anchor.getAttribute('data-title') || '';
					if (!currentTitle.includes('lb-watch-video')) {
						const captionLink = ` <span class="lb-sep" aria-hidden="true">•</span> <a href="#" class="lb-watch-video" data-yt="${escapeAttr(ytSrc)}">Watch video</a>`;
						anchor.setAttribute('data-title', (currentTitle ? currentTitle + ' ' : '') + captionLink);
					}
				}
			}
		}
	});

	const modal = createVideoModal();
	function openVideoModal(src) {
		if (!src) return;
		const needsAmp = src.includes('?');
		const autoplaySrc = src + (needsAmp ? '&' : '?') + 'autoplay=1';
		const iframe = modal.querySelector('iframe');
		iframe.setAttribute('src', autoplaySrc);
		modal.classList.add('open');
		modal.querySelector('.video-modal__close').focus();
		document.body.style.overflow = 'hidden';
	}

	function closeVideoModal() {
		modal.classList.remove('open');
		const iframe = modal.querySelector('iframe');
		iframe.setAttribute('src', '');
		document.body.style.overflow = '';
	}

	function createVideoModal() {
		let modal = document.getElementById('videoModal');
		if (modal) return modal;
		modal = document.createElement('div');
		modal.id = 'videoModal';
		modal.className = 'video-modal';
		modal.innerHTML = `
			<div class="video-modal__backdrop" role="presentation"></div>
			<div class="video-modal__dialog" role="dialog" aria-modal="true" aria-label="Video">
				<button class="video-modal__close" aria-label="Close video">✕</button>
				<div class="video-modal__frame">
					<iframe
						src=""
						title="YouTube video player"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
					></iframe>
				</div>
			</div>`;
		document.body.appendChild(modal);

		modal.addEventListener('click', (e) => {
			if (e.target.classList.contains('video-modal__backdrop')) {
				closeVideoModal();
			}
		});
		modal.querySelector('.video-modal__close').addEventListener('click', closeVideoModal);
		document.addEventListener('keydown', (e) => {
			if (modal.classList.contains('open') && e.key === 'Escape') {
				closeVideoModal();
			}
		});
		return modal;
	}

	function closeLightboxIfOpen(next) {
		const lbRoot = document.getElementById('lightbox');
		const isOpen = lbRoot && window.getComputedStyle(lbRoot).display !== 'none';
		if (isOpen) {
			const closeBtn = lbRoot.querySelector('.lb-close');
			if (closeBtn) closeBtn.click();
			return setTimeout(() => next && next(), 200);
		}
		if (window.lightbox && typeof window.lightbox.end === 'function') {
			try { window.lightbox.end(); } catch (_) { }
			return setTimeout(() => next && next(), 150);
		}
		return next && next();
	}

	document.addEventListener('click', (e) => {
		const link = e.target.closest('.lb-watch-video');
		if (link) {
			e.preventDefault();
			e.stopPropagation();
			const src = link.getAttribute('data-yt');
			closeLightboxIfOpen(() => openVideoModal(src));
		}
	});
});

