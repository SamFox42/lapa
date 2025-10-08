// product.html?id=<product-id>
const productDB = {
  "dry-puppy-beef": { title: "Дай Лапу для щенков всех пород с говядиной, яблоком и морковью" },
  "dry-adult-beef": { title: "Дай Лапу для взрослых собак средних и крупных пород с говядиной, яблоком и морковью" },
  "dry-adult-duck-beef-turkey": { title: "Дай Лапу для взрослых собак с уткой, говядиной и индейкой" },
  "dry-sterilized-duck-turkey": { title: "Дай Лапу для стерилизованных кошек с уткой и индейкой" },
  "dry-adult-beef-turkey": { title: "Дай Лапу для взрослых кошек с говядиной и индейкой" },
  "dry-sterilized-beef": {title: "Дай Лапу для стерестерилизованных кошек с говядиной"},
  "dry-adult-duck": {title: "Дай Лапу для взрослых кошек с уткой, говядиной и индейкой"}
};

function getParam(key){return new URLSearchParams(location.search).get(key);}

function safeImg(src){
  const img = new Image();
  img.src = src;
  img.alt = "";
  img.onerror = () => img.remove();
  return img;
}

(function init(){
  const id = getParam('id');
  const data = productDB[id] || null;

  if(!id || !data){
    const c = document.querySelector('.product-wrap .container');
    c.innerHTML = '<h2>Продукт не найден</h2>';
    return;
  }

  document.getElementById('product-title').textContent = data.title;

  document.getElementById('name-img').src = `images/products/${id}/name.png`;
  document.getElementById('weight-img').src = `images/products/${id}/weight.png`;
  document.getElementById('composition-img').src = `images/products/${id}/composition.png`;
  document.getElementById('feeding-img').src = `images/products/${id}/feeding.png`;

  const col = document.getElementById('ingredients-col');
  for(let i=1;i<=8;i++){
    const el = safeImg(`images/products/${id}/ingredient-${i}.png`);
    el.className = 'ingredient-img';
    col.appendChild(el);
  }

  // после того как получили id и data
  const packSlot = document.getElementById('pack-slot');
  if (packSlot) {
    const pack = safeImg(`images/products/${id}/pack.png`);
    pack.className = 'pack-img';
    packSlot.appendChild(pack);
  }

})();