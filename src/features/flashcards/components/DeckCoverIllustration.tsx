import type { Lesson } from "@/data/discoveryData";

const palettes = {
  Heritage: ["#244e43", "#dbbe82", "#386554"],
  Cuisine: ["#9b583b", "#ffe0a7", "#b87550"],
  Crafts: ["#b59258", "#fff0c7", "#c6a970"],
  Nature: ["#47776c", "#e2e6c4", "#639183"],
  Folklore: ["#7e4943", "#f4ce8d", "#a36350"],
};

/** Local, decorative artwork keeps catalog covers relevant to their topic. */
export function DeckCoverIllustration({ category, className = "" }: { category: Lesson["category"]; className?: string }) {
  const [background, ink, accent] = palettes[category];
  return (
    <svg className={className} viewBox="0 0 480 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <path fill={background} d="M0 0h480v240H0z" />
      <circle cx="368" cy="64" r="82" fill={accent} opacity=".5" />
      <circle cx="85" cy="210" r="105" fill={accent} opacity=".3" />
      <g stroke={ink} opacity=".12"><path d="M0 210H480M0 221H480M0 232H480M25 0V240M455 0V240" /><circle cx="240" cy="123" r="98" /><circle cx="240" cy="123" r="91" /></g>
      {category === "Heritage" && <g stroke={ink} strokeWidth="2" strokeLinejoin="round">
        <path d="M104 202H376M124 194H356M139 185H341M151 185V131H329V185M174 185V143H215V185M265 185V143H306V185M228 185V151Q240 135 252 151V185" />
        <path fill={accent} d="M129 131Q153 124 163 108H317Q327 124 351 131H129Z" />
        <path d="M163 108V98M317 108V98M184 106V76H296V106M212 106V82M240 106V82M268 106V82" />
        <path fill={accent} d="M166 76Q193 67 201 51H279Q287 67 314 76H166Z" />
        <path d="M201 51L197 43M279 51L283 43M174 194V185M306 194V185M109 156H149M331 156H371M118 156V185M362 156V185" />
        <circle cx="240" cy="93" r="5" /><path opacity=".4" d="M62 139H100M380 116H421M66 148H88M396 125H430" />
      </g>}
      {category === "Cuisine" && <g stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="239" cy="200" rx="103" ry="8" opacity=".3" />
        <path fill={accent} d="M137 119H343Q329 185 263 185H217Q151 185 137 119Z" />
        <ellipse cx="240" cy="119" rx="104" ry="23" fill={background} />
        <path d="M151 122Q240 157 329 122M219 185V194H262V185M172 112Q192 97 212 113T253 112T301 112M188 121Q207 105 226 121T266 121T306 121M275 104L335 41M286 107L350 47M209 80Q196 65 209 49M232 78Q219 62 232 46M255 78Q242 62 255 46" />
        <path opacity=".4" d="M94 159H115M365 157H389M75 168H105M373 166H405" />
        <path d="M184 108Q177 91 189 96Q202 88 199 105M248 112Q245 96 256 100Q269 94 264 110" />
      </g>}
      {category === "Crafts" && <g stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path fill={accent} d="M240 52L102 166Q240 209 378 166L240 52Z" />
        <path d="M240 52L130 172M240 52L170 180M240 52L216 185M240 52L264 185M240 52L310 180M240 52L350 172M201 83Q240 97 279 83M175 108Q240 131 305 108M145 137Q240 168 335 137M111 162Q240 202 369 162" />
        <path d="M202 185Q199 222 239 216Q279 212 278 185M209 186Q207 211 237 208Q269 208 271 186" />
        <path opacity=".4" d="M93 100L105 109M98 91L110 100M372 98L361 108M382 106L371 116" />
      </g>}
      {category === "Nature" && <g stroke={ink} strokeWidth="2" strokeLinejoin="round">
        <circle cx="310" cy="66" r="22" fill={ink} opacity=".7" stroke="none" />
        <path fill={accent} d="M46 181L87 133L103 140L133 87L155 83L179 148L201 177M160 181L210 113L232 119L248 68L271 74L294 144L320 181M279 181L326 120L347 116L375 152L396 144L431 181" />
        <path d="M0 184H480M37 199H168M239 199H406M109 213H269M319 213H446M89 163L107 145M225 160L245 118M338 158L349 135M154 184H339" />
        <path d="M193 188Q210 198 226 188M210 187V165L231 184H210M201 184L208 173V184" />
        <path opacity=".5" d="M75 56Q85 48 95 56Q105 48 115 56M369 71Q379 63 389 71Q399 63 409 71" />
      </g>}
      {category === "Folklore" && <g stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 30Q240 95 480 30M150 59V80M242 63V96M331 59V76" />
        <path fill={accent} d="M139 81H161Q190 110 161 143H139Q110 110 139 81ZM227 96H257Q297 135 257 178H227Q187 135 227 96ZM320 77H342Q371 105 342 137H320Q291 105 320 77Z" />
        <path d="M150 81Q132 110 150 143Q168 110 150 81ZM242 96Q216 135 242 178Q268 135 242 96ZM331 77Q313 105 331 137Q349 105 331 77ZM139 143H161M227 178H257M320 137H342M150 143V166M145 162V173M155 162V173M242 178V202M236 198V210M248 198V210M331 137V160M326 156V168M336 156V168" />
        <path opacity=".5" d="M87 118V128M82 123H92M380 169V179M375 174H385M183 195V203M179 199H187" />
      </g>}
    </svg>
  );
}
