function createUniqeName(originalName){
    const uniqeId = Date.now().toString(36)+Math.random().toString(36);
    return `${uniqeId+originalName}`;
}

module.exports = {createUniqeName}