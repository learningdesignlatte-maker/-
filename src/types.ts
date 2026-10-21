export type PersonaGender = 'male' | 'female';

export interface PersonaProfile {
  id: PersonaGender;
  name: string; // e.g. 山田 健一
  nameKana: string; // e.g. ヤマダ ケンイチ
  nameKanaHiragana: string; // e.g. やまだ けんいち (for error demonstration)
  gender: string; // 男性 or 女性
  birthDateFull: string; // 昭和52年5月14日 (1977年5月14日)
  birthYear: string; // 1977
  birthMonth: string; // 05
  birthDay: string; // 14
  postalCodeRaw: string; // 1000001
  postalCodeHyphen: string; // 100-0001
  postalCodeZen: string; // １００－０００１
  prefecture: string; // 東京都
  city: string; // 千代田区
  // Full-width address required by administrative forms:
  addressBanchiZen: string; // 千代田１－１
  addressBanchiHan: string; // 千代田1-1 (error state)
  buildingZen: string; // パソコンハイツ２０１号室
  buildingHan: string; // パソコンハイツ201号室
  phoneNumberHanNoHyphen: string; // 09012345678
  phoneNumberHanHyphen: string; // 090-1234-5678
  phoneNumberZen: string; // ０９０－１２３４－５６７８
  email: string; // yamada.kenichi@example.com
  emailZen: string; // ｙａｍａｄａ．ｋｅｎｉｃｈｉ＠ｅｘａｍｐｌｅ．ｃｏｍ
  photoUrl: string;
  licenseNumber: string; // 第301234567890号
  occupation: string;
}

export type PracticePatternId = 'pattern1' | 'pattern2' | 'pattern3' | 'patternExam';

export interface FormValues {
  kanjiName: string;
  kanaName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressBanchi: string; // The crucial "大文字（全角）" target
  building: string;
  phone: string;
  email: string;
}

export interface FieldValidationResult {
  hasError: boolean;
  message: string;
  tip: string;
  causeType?: 'han_instead_of_zen' | 'zen_instead_of_han' | 'hiragana_instead_of_kana' | 'hyphen_present' | 'empty' | 'format';
}

export type FormErrors = Partial<Record<keyof FormValues, FieldValidationResult>>;

export type FontSize = 'normal' | 'large' | 'xlarge';
