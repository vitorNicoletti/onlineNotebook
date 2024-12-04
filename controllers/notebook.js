const User = require('../models/User');
const Page = require('../models/Page');

const getUserNotebook = async (req, res) => {
    const id = req.user.id;
    const pages = await Page.find({ userId: id });

    if (!pages) {
        return errorPagesDontExist(res);
    }
    if (pages.length <= 0){
        return res.status(200).json({content:"No nootebook created!"})
    }

    const { inicialPage, nLoadedPages } = req.body;

    if (inicialPage == null) {
        return res.status(404).json({ content: "inicialPage not in request" });
    }
    if (nLoadedPages == null) {
        return res.status(404).json({ content: "nLoadedPages not in request" });
    }

    const maxNumPage = nLoadedPages + inicialPage;
    const resultPages = pages.filter(val => val.number >= inicialPage && val.number <= maxNumPage);

    return res.status(200).json({ content: "notebook found!", pages: resultPages });
};

const updateUserNotebook = async (req, res) => {
    const newPages = req.body.pages;

    newPages.sort((a, b) => a.number - b.number);

    for (let i = 0; i < newPages.length; i++) {
        try {
            const existingPage = await Page.findOne({ userId: req.user.id, number: newPages[i].number });
    
            if (existingPage !== null) {
                
                // Atualiza os campos da página existente
                existingPage.content = newPages[i].content;
                await existingPage.save();
            } else if (await numIsCorrect(newPages[i].number, req.user.id) || (await getIntOfPages(req) == 0 && newPages[i].number == 1)){
                console.log('sgdsg')
                // Cria uma nova página se não existir
                createNewPage(req,newPages[i])
            } else {
                // Caso a numeração esteja incorreta
                return res.status(401).json({ content: "Numeration done wrong!" });
            }
        } catch (err) {
            return res.status(500).json({ content: "Failed to update notebook", error: err.message });
        }
    }

    // Finaliza com sucesso
    return res.status(200).json({ content: "Notebook updated successfully!" });
};



const getTotalPages = async (req,res) =>{
    const nPages = await getIntOfPages(req)
    if (nPages == null) {
        return errorPagesDontExist(res);
    }
    return res.status(200).json({content: "Number os pages retrieved correctely!", totalPages: nPages})
}


async function createNewPage(req,newPage){
    const page = new Page({
        userId: req.user.id,
        content: newPage.content,
        number: newPage.number
    });
    await page.save();
}
async function getIntOfPages(req){
    const id = req.user.id;
    const pages = await Page.find({ userId: id });
    return pages.length
}

async function numIsCorrect(num, id) {
    const a =  await Page.findOne({ userId: id, number: (num - 1) })
    return  (a !== null);
}

function errorPagesDontExist(res) {
    return res.status(404).json({ content: "Occurred an error finding your userID, please, try again later!" });
}

module.exports = { 
    getUserNotebook,
    updateUserNotebook,
    getTotalPages
};
