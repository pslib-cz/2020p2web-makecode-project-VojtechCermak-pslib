// Add your code here
class Attachment
{
    _maxamount: number // maximální množství
    _amount: number // momentální množství
    _atType: number // typ zařízení
    sprite: Sprite // sprite zařízení

    /*konstruktor třídy Attachment
    * na vstupu bere: typ - SpriteKind pro daný sprite 
    *                 spriteImg - obrázek daného spritu
    *                 maxamount - maxmální možné množsí které jde uložit
    */
    constructor(typ: number, spriteImg: Image, maxamount:number)
    {
        this._atType = typ;
        this.sprite = sprites.create(spriteImg, typ)
        this._maxamount = maxamount;
        this._amount = 0;
    }

    set Sprite(newSprite: Sprite){this.sprite = newSprite}
    get Sprite(){return this.sprite}
    get atType(){return this._atType}
    get maxAmount(){return this._maxamount}
    set amount(num: number){this._amount = num}
    get amount(){return this._amount}
    
}