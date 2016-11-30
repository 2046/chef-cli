export default function(text, exit) {
    text = text.map((item, index) => {
        return text.length - 1 === index ? item : `${item}\n`
    }).join('')

    console.log(text)
    exit && process.exit(1)
}
