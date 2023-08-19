// コンテキストメニューを作成する
chrome.contextMenus.create({ title: 'テンプレート', id: 'template_top', contexts: ['editable']});

// シーン1に関するコンテキストメニューの作成
// テンプレート → シーン1
chrome.contextMenus.create({ title: 'シーン1', id: 'template_scene1', parentId: 'template_top', contexts: ['editable']});

// シーン1 → hoge, fuga
chrome.contextMenus.create({ title: 'hoge', id: 'template_scene1_hoge', parentId: 'template_scene1', contexts: ['editable']});
chrome.contextMenus.create({ title: 'fuga', id: 'template_scene1_fuga', parentId: 'template_scene1', contexts: ['editable']});

// シーン2に関するコンテキストメニューの作成
// テンプレート → シーン2
chrome.contextMenus.create({ title: 'シーン2', id: 'template_scene2', parentId: 'template_top', contexts: ['editable']});

// シーン2 → hoge, fuga
chrome.contextMenus.create({ title: 'hoge', id: 'template_scene2_hoge', parentId: 'template_scene2', contexts: ['editable']});
chrome.contextMenus.create({ title: 'fuga', id: 'template_scene2_fuga', parentId: 'template_scene2', contexts: ['editable']});



chrome.contextMenus.onClicked.addListener(async (info, tab) => {

    const fileName = getFileName(info.menuItemId);
    const templateText = await getMessage(fileName);

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: insertTextAtCursorPosition,
        args: [templateText]
    });
});

function getFileName(contextItemId){
    switch(contextItemId){
        case "template_scene1_hoge":
            return "1_hoge.txt";
        
        case "template_scene1_fuga":
            return "1_fuga.txt";

        case "template_scene2_hoge":
            return "2_hoge.txt";

        case "template_scene2_fuga":
            return "2_fuga.txt";
    }
}

async function getMessage(fileName){
    try{
        const message = fetchMessageFromFile(fileName);
        return message;
    } catch (error){
        return "Load ERROR";
    }
}

async function fetchMessageFromFile(fileName){
    const response = await fetch(chrome.runtime.getURL(`templateText/${fileName}`));

    if(response.ok){
        const message = await response.text();
        return message;
    }
    else{
        "Load ERROR";
    }
}

function insertTextAtCursorPosition(text){
    const activeElement = document.activeElement;

    if(activeElement.type === "textarea"){
        const startPosition = activeElement.selectionStart;
        const endPosition = activeElement.selectionEnd;

        const currentValue = activeElement.value;
        const newValue =
                currentValue.substring(0, startPosition) + 
                text +
                currentValue.substring(endPosition, currentValue.length);
        
        activeElement.value = newValue;

        const newCursorPosition = startPosition + text.length;
        activeElement.selectionStart = newCursorPosition;
        activeElement.selectionEnd = newCursorPosition;
    }
}
