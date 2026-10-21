import { FormErrors, FormValues } from '../types';

// Helpers to detect character widths
export function hasHalfWidthAlphaNumOrHyphen(str: string): boolean {
  return /[0-9a-zA-Z\-\/]/.test(str);
}

export function hasFullWidthDigits(str: string): boolean {
  return /[０-９]/.test(str);
}

export function hasFullWidthAlpha(str: string): boolean {
  return /[ａ-ｚＡ-Ｚ]/.test(str);
}

export function hasHiragana(str: string): boolean {
  return /[\u3040-\u309F]/.test(str);
}

export function hasHalfWidthKana(str: string): boolean {
  return /[\uFF61-\uFF9F]/.test(str);
}

export function isPureFullWidthKatakana(str: string): boolean {
  return /^[\u30A0-\u30FF\u30FC\s　]+$/.test(str);
}

// Convert half-width ASCII numbers/hyphens to full-width
export function toFullWidth(str: string): string {
  return str
    .replace(/[0-9]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0xfee0))
    .replace(/-/g, '－')
    .replace(/a-z/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0xfee0))
    .replace(/A-Z/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0xfee0));
}

// Convert full-width numbers/hyphens to half-width
export function toHalfWidth(str: string): string {
  return str
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/－/g, '-')
    .replace(/ー/g, '-')
    .replace(/[ａ-ｚ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}

// Convert Hiragana to Katakana
export function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

export function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  // 1. Kanji Name
  if (!values.kanjiName.trim()) {
    errors.kanjiName = {
      hasError: true,
      message: '※氏名を入力してください',
      tip: '見本カードに書かれているお名前を漢字で入力してください。',
      causeType: 'empty',
    };
  }

  // 2. Kana Name
  if (!values.kanaName.trim()) {
    errors.kanaName = {
      hasError: true,
      message: '※フリガナを入力してください',
      tip: 'お名前の読み仮名を全角カタカナで入力します。',
      causeType: 'empty',
    };
  } else if (hasHiragana(values.kanaName)) {
    errors.kanaName = {
      hasError: true,
      message: '※フリガナは全角カタカナで入力してください',
      tip: 'ひらがなで入力されています。カタカナに変換してご入力ください。（例：ヤマダ）',
      causeType: 'hiragana_instead_of_kana',
    };
  } else if (hasHalfWidthKana(values.kanaName)) {
    errors.kanaName = {
      hasError: true,
      message: '※フリガナは全角カタカナで入力してください',
      tip: '半角カタカナになっています。全角カタカナでご入力ください。',
      causeType: 'han_instead_of_zen',
    };
  } else if (!isPureFullWidthKatakana(values.kanaName)) {
    errors.kanaName = {
      hasError: true,
      message: '※フリガナは全角カタカナのみで入力してください',
      tip: '英数字や記号が含まれていないかご確認ください。',
      causeType: 'format',
    };
  }

  // 3. Birth year / month / day
  if (!values.birthYear || !values.birthMonth || !values.birthDay) {
    errors.birthYear = {
      hasError: true,
      message: '※生年月日を正しく選択・入力してください',
      tip: '見本カードに記載された年月日を入力してください。',
      causeType: 'empty',
    };
  }

  // 4. Postal Code
  const cleanPostal = values.postalCode.trim();
  if (!cleanPostal) {
    errors.postalCode = {
      hasError: true,
      message: '※郵便番号を入力してください',
      tip: '7桁の半角数字で入力します。（例：1000001）',
      causeType: 'empty',
    };
  } else if (hasFullWidthDigits(cleanPostal) || hasFullWidthAlpha(cleanPostal)) {
    errors.postalCode = {
      hasError: true,
      message: '※郵便番号は半角数字で入力してください',
      tip: '全角数字（大文字）になっています。半角数字（小文字）で打ち直してください。',
      causeType: 'zen_instead_of_han',
    };
  } else if (cleanPostal.includes('-') || cleanPostal.includes('－')) {
    errors.postalCode = {
      hasError: true,
      message: '※郵便番号はハイフンなしの半角数字7桁で入力してください',
      tip: 'ハイフン「-」は入力せず、数字7桁だけを入力してください。（例：1000001）',
      causeType: 'hyphen_present',
    };
  } else if (!/^\d{7}$/.test(cleanPostal)) {
    errors.postalCode = {
      hasError: true,
      message: '※郵便番号は7桁の半角数字で入力してください',
      tip: '数字の桁数が7桁になっているかご確認ください。',
      causeType: 'format',
    };
  }

  // 5. Prefecture & City
  if (!values.prefecture.trim()) {
    errors.prefecture = {
      hasError: true,
      message: '※都道府県を選択してください',
      tip: '見本カードの都道府県をお選びください。',
      causeType: 'empty',
    };
  }
  if (!values.city.trim()) {
    errors.city = {
      hasError: true,
      message: '※市区町村を入力してください',
      tip: '見本カードの市区町村を入力してください。',
      causeType: 'empty',
    };
  }

  // 6. Address Banchi (CRITICAL REQUIREMENT)
  const cleanBanchi = values.addressBanchi.trim();
  if (!cleanBanchi) {
    errors.addressBanchi = {
      hasError: true,
      message: '※住所（番地）を入力してください',
      tip: '番地・号を入力してください。※数字やハイフンは大文字（全角）です。',
      causeType: 'empty',
    };
  } else if (hasHalfWidthAlphaNumOrHyphen(cleanBanchi)) {
    // Crucial warning specified by user
    errors.addressBanchi = {
      hasError: true,
      message: '※住所は大文字で入力してください',
      tip: '番地の数字やハイフンが小文字（半角）になっています。「1-1」ではなく全角の「１－１」でご入力ください。キーボードのF9キーまたは全角変換をお使いください。',
      causeType: 'han_instead_of_zen',
    };
  }

  // 6.5 Building (if entered with half-width digits)
  if (values.building.trim() && hasHalfWidthAlphaNumOrHyphen(values.building)) {
    errors.building = {
      hasError: true,
      message: '※建物名・部屋番号の数字は大文字（全角）で入力してください',
      tip: '部屋番号の「201」が半角になっています。全角の「２０１号室」に直してください。',
      causeType: 'han_instead_of_zen',
    };
  }

  // 7. Phone
  const cleanPhone = values.phone.trim();
  if (!cleanPhone) {
    errors.phone = {
      hasError: true,
      message: '※電話番号を入力してください',
      tip: 'ハイフンなしの半角数字で入力します。（例：09012345678）',
      causeType: 'empty',
    };
  } else if (hasFullWidthDigits(cleanPhone)) {
    errors.phone = {
      hasError: true,
      message: '※電話番号は半角数字で入力してください',
      tip: '大文字（全角）の数字になっています。半角数字に打ち直してください。',
      causeType: 'zen_instead_of_han',
    };
  } else if (cleanPhone.includes('-') || cleanPhone.includes('－')) {
    errors.phone = {
      hasError: true,
      message: '※電話番号はハイフン（-）を入れずに半角数字で入力してください',
      tip: 'ハイフンを消して、数字だけを続けて入力してください。（例：09012345678）',
      causeType: 'hyphen_present',
    };
  } else if (!/^\d{10,11}$/.test(cleanPhone)) {
    errors.phone = {
      hasError: true,
      message: '※電話番号は10桁または11桁の半角数字で入力してください',
      tip: '桁数が不足しているか多すぎます。ご確認ください。',
      causeType: 'format',
    };
  }

  // 8. Email
  const cleanEmail = values.email.trim();
  if (!cleanEmail) {
    errors.email = {
      hasError: true,
      message: '※メールアドレスを入力してください',
      tip: '連絡用メールアドレスを半角英数小文字で入力してください。',
      causeType: 'empty',
    };
  } else if (hasFullWidthAlpha(cleanEmail) || hasFullWidthDigits(cleanEmail) || cleanEmail.includes('＠') || cleanEmail.includes('．')) {
    errors.email = {
      hasError: true,
      message: '※メールアドレスは小文字（半角英数）で入力してください',
      tip: 'アドレスの中に大文字（全角）が含まれています。すべて半角英数字で入力してください。',
      causeType: 'zen_instead_of_han',
    };
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanEmail)) {
    errors.email = {
      hasError: true,
      message: '※メールアドレスの形式が正しくありません',
      tip: '「@」や「.com」の綴りをご確認ください。',
      causeType: 'format',
    };
  }

  return errors;
}
