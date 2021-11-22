'use strict';

/**
 * 
 * @returns
 */
export default class FontTools {
    
  /**
   *
   */  
  fontSpecToStyle (aStyle) {
    let fontBold="normal";
    let fontItalic="normal";
 
    if (aStyle.typeface=="Bold") {
      fontBold="bold";
    }

    if (aStyle.typeface=="Italic") {
      fontItalic="italic";
    }

    if (aStyle.typeface=="Bold Italic") {
      fontBold="bold";
      fontItalic="italic";
    }

    return ({fontFamily: aStyle.font, fontWeight: fontBold, fontStyle: fontItalic, fontSize: aStyle.size});
  }

  /**
   *
   */
  fontGetDefaultStyle () {
    return ({fontFamily: "Verdana", fontWeight: "normal", fontStyle: "normal", fontSize: "10pt"});
  }

  /**
   *
   */  
  fontSpecToSample (aStyle) {
    return (aStyle.font + " - " + aStyle.size + "pt");
  }  
  
  /**
   * .small { font: italic 13px sans-serif; }
   */
  fontSpectToSVGStyle (aStyle) {
    let stringStyle=aStyle.font + " " + aStyle.size + ".pt " + aStyle.typeface;
    return ({font: stringStyle});
  }
}
