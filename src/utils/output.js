export default function(text) {
    console.log(text.map((item, index) => (text.length - 1) === index ? item : `${item}\n`).join(''))
}
