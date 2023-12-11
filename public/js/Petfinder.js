// 用于从 The Cat API 获取随机猫咪图片的函数
async function fetchRandomCatImage() {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from The Cat API');
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const randomCatImage = data[0].url; // 获取随机猫咪图片的 URL
            return randomCatImage;
        } else {
            throw new Error('No cat images found');
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// 更新页面上的猫咪图片
async function updateCatImage() {
    const randomImage = await fetchRandomCatImage();
    if (randomImage) {
        const imgElement = document.getElementById('randomImage');
        imgElement.src = randomImage;
    }
}

// 初次加载时显示随机猫咪图片
updateCatImage();

// 当点击链接时，更新随机猫咪图片
const linkElement = document.createElement('a');
linkElement.textContent = 'Get another Pet';
linkElement.href = 'javascript:void(0)';
linkElement.addEventListener('click', updateCatImage);
document.body.appendChild(linkElement);
