import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function SecretLetter({ label, title, bullets, imageSrc, imageAlt, className }) {
	const [stage, setStage] = useState('closed'); // closed | opening | open

	function handleOpen() {
		setStage('opening');
		window.setTimeout(() => setStage('open'), 30);
	}

	function handleClose() {
		setStage('closed');
	}

	const isVisible = stage !== 'closed';

	return (
		<>
			<button type="button" className={'an-secret-trigger' + (className ? ` ${className}` : '')} onClick={handleOpen}>
				<span className="an-secret-envelope" aria-hidden="true">
					<span className="an-secret-envelope-flap" />
					<span className="an-secret-envelope-seal">◈</span>
				</span>
				<span className="an-secret-trigger-label">{label}</span>
			</button>

			{isVisible &&
				typeof document !== 'undefined' &&
				createPortal(
					<div
						className="an-secret-overlay not-content"
						role="dialog"
						aria-modal="true"
						onClick={(event) => {
							if (event.target === event.currentTarget) handleClose();
						}}
					>
						<div className={'an-secret-letter' + (stage === 'open' ? ' is-open' : '')}>
							<button type="button" className="an-secret-close" onClick={handleClose} aria-label="닫기">
								×
							</button>
							{imageSrc && <img src={imageSrc} alt={imageAlt || ''} className="an-secret-image" />}
							<p className="an-secret-title">{title}</p>
							<ul className="an-secret-bullets">
								{bullets.map((line, i) => (
									<li key={i}>{line}</li>
								))}
							</ul>
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
