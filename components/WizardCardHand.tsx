import { Crown } from 'lucide-react'

export default function WizardCardHand () {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 560 420"
			className="wizard-card-hand"
		>
			<defs>
				<radialGradient id="wizard-table-felt">
					<stop offset="0" stopColor="#183c30" />
					<stop offset="1" stopColor="#0a1b16" />
				</radialGradient>
				<pattern
					id="wizard-card-weave"
					width="14" height="14" patternUnits="userSpaceOnUse"
				>
					<path
						d="M7 0 14 7 7 14 0 7Z"
						fill="none" stroke="#d4a853" strokeOpacity=".16"
					/>
				</pattern>
			</defs>

			<ellipse
				cx="280" cy="258" rx="259" ry="137"
				fill="url(#wizard-table-felt)" stroke="#d4a853"
				strokeOpacity=".3"
			/>
			<ellipse
				cx="280" cy="258" rx="245" ry="124"
				fill="none" stroke="#d4a853" strokeOpacity=".16"
			/>
			<path
				d="M24 258h30m452 0h30M280 121v22m0 230v22"
				stroke="#d4a853" strokeOpacity=".35"
			/>

			<g transform="translate(109 101) rotate(-19 82 121)">
				<g>
					<rect width="164" height="242" rx="5" fill="#0b1511" />
					<rect
						x="1" y="1" width="162" height="240" rx="4"
						fill="url(#wizard-card-weave)" stroke="#b38b43"
					/>
					<rect
						x="10" y="10" width="144" height="222" rx="2"
						fill="none" stroke="#d4a853" strokeOpacity=".5"
					/>
					<path
						d="m82 61 43 60-43 60-43-60Z"
						fill="#10271e" stroke="#d4a853"
					/>
					<path
						d="m82 91 8 22 23 8-23 8-8 22-8-22-23-8 23-8Z"
						fill="#d4a853"
					/>
				</g>
			</g>

			<g transform="translate(295 102) rotate(17 82 121)">
				<g>
					<rect
						width="164" height="242" rx="5"
						fill="#231412" stroke="#b38b43"
					/>
					<rect
						x="10" y="10" width="144" height="222" rx="2"
						fill="none" stroke="#d4a853" strokeOpacity=".4"
					/>
					<g fill="#e9c882" fontFamily="Georgia, serif" fontSize="30">
						<text x="20" y="43">7</text>
						<text x="20" y="43" transform="rotate(180 82 121)">7</text>
					</g>
					<circle
						cx="82" cy="121" r="38" fill="none"
						stroke="#d4a853" strokeOpacity=".5"
					/>
					<path
						d="m82 88 8 22 22-5-13 16 13 16-22-5-8 22-8-22-22 5 13-16-13-16 22 5Z"
						fill="#a75a38" stroke="#d4a853"
					/>
				</g>
			</g>

			<g transform="translate(197 56) rotate(-3 83 126)">
				<g>
					<rect
						width="166" height="252" rx="5"
						fill="#f3e9d2" stroke="#e6bf73" strokeWidth="2"
					/>
					<rect
						x="10" y="10" width="146" height="232" rx="2"
						fill="none" stroke="#9c743b" strokeWidth=".75"
					/>
					<g
						fill="#34291b" fontFamily="Georgia, serif"
						fontSize="26" fontWeight="bold"
					>
						<text x="19" y="42">W</text>
						<text x="19" y="42" transform="rotate(180 83 126)">W</text>
					</g>
					<path
						d="M83 58 137 126 83 194 29 126Z"
						fill="none" stroke="#b18a4b" strokeOpacity=".55"
					/>
					<circle cx="83" cy="126" r="44" fill="#151510" />
					<circle
						cx="83" cy="126" r="39" fill="none"
						stroke="#d4a853" strokeWidth=".75"
					/>
					<Crown
						x="56" y="99" width="54" height="54"
						stroke="#e6bf73" strokeWidth="1.2"
					/>
					<text
						x="83" y="219" textAnchor="middle" fill="#6c5129"
						fontFamily="Georgia, serif" fontSize="10"
						letterSpacing="3"
					>
						WIZARD
					</text>
				</g>
			</g>
		</svg>
	)
}
