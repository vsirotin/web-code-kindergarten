import { BehaviorSubject, Observable } from 'rxjs';
import { KeeperCurrentUserLanguage } from '@vsirotin/keeper-master-data';

export interface ILanguageChangeNotificator {
  selectionChanged$: Observable<ILanguageDescription>;
  selectionChanged(selectedLanguage: ILanguageDescription): void;
}

export interface ILanguageDescription {
  enName: string;
  originalName: string;
  ietfTag: string;
}

export const DEFAULT_LANG_TAG = "en-US";
export const DEFAULT_LANG_DESCRIPTION: ILanguageDescription = { "enName": "English", "originalName": "English", "ietfTag": DEFAULT_LANG_TAG };

const SupportedLanguages: Array<ILanguageDescription> = [
  { "enName": "Arabic", "originalName": "العربية", "ietfTag": "ar-SA" },
  { "enName": "Bengali", "originalName": "বাংলা", "ietfTag": "bn-BD" },
  { "enName": "Bulgarian", "originalName": "български", "ietfTag": "bg-BG" },
  { "enName": "Catalan, Valencian", "originalName": "català, valencià", "ietfTag": "ca-ES" },
  { "enName": "Chinese", "originalName": "中文", "ietfTag": "zh-CN" },
  { "enName": "Croatian", "originalName": "hrvatski", "ietfTag": "hr-HR" },
  { "enName": "Czech", "originalName": "český", "ietfTag": "cs-CZ" },
  { "enName": "Danish", "originalName": "dansk", "ietfTag": "da-DK" },
  { "enName": "Dutch, Flemish", "originalName": "Nederlands, Vlaams", "ietfTag": "nl-NL" },
  { "enName": "English", "originalName": "English", "ietfTag": "en-US" },
  { "enName": "Estonian", "originalName": "eesti", "ietfTag": "et-EE" },
  { "enName": "Finnish", "originalName": "suomi", "ietfTag": "fi-FI" },
  { "enName": "French", "originalName": "français", "ietfTag": "fr-FR" },
  { "enName": "German", "originalName": "Deutsch", "ietfTag": "de-DE" },
  { "enName": "Greek", "originalName": "Ελληνικά", "ietfTag": "el-GR" },
  { "enName": "Hebrew", "originalName": "עברית", "ietfTag": "he-IL" },
  { "enName": "Hungarian", "originalName": "magyar", "ietfTag": "hu-HU" },
  { "enName": "Indonesian", "originalName": "Bahasa Indonesia", "ietfTag": "id-ID" },
  { "enName": "Italian", "originalName": "italiano", "ietfTag": "it-IT" },
  { "enName": "Japanese", "originalName": "日本語", "ietfTag": "ja-JP" },
  { "enName": "Korean", "originalName": "한국어", "ietfTag": "ko-KR" },
  { "enName": "Latvian", "originalName": "latviešu", "ietfTag": "lv-LV" },
  { "enName": "Lithuanian", "originalName": "lietuvių", "ietfTag": "lt-LT" },
  { "enName": "Norwegian", "originalName": "Norsk", "ietfTag": "no-NO" },
  { "enName": "Norwegian Bokmål", "originalName": "Norsk bokmål", "ietfTag": "nb-NO" },
  { "enName": "Persian", "originalName": "فارسی", "ietfTag": "fa-IR" },
  { "enName": "Polish", "originalName": "polski", "ietfTag": "pl-PL" },
  { "enName": "Portuguese", "originalName": "Português", "ietfTag": "pt-PT" },
  { "enName": "Punjabi", "originalName": "ਪੰਜਾਬੀ", "ietfTag": "pa-IN" },
  { "enName": "Romanian", "originalName": "română", "ietfTag": "ro-RO" },
  { "enName": "Russian", "originalName": "Русский", "ietfTag": "ru-RU" },
  { "enName": "Serbian", "originalName": "српски", "ietfTag": "sr-RS" },
  { "enName": "Slovak", "originalName": "slovenčina", "ietfTag": "sk-SK" },
  { "enName": "Slovenian", "originalName": "slovenščina", "ietfTag": "sl-SI" },
  { "enName": "Spanish", "originalName": "Español", "ietfTag": "es-ES" },
  { "enName": "Swedish", "originalName": "svenska", "ietfTag": "sv-SE" },
  { "enName": "Thai", "originalName": "ไทย", "ietfTag": "th-TH" },
  { "enName": "Turkish", "originalName": "Türkçe", "ietfTag": "tr-TR" },
  { "enName": "Ukrainian", "originalName": "українська", "ietfTag": "uk-UA" },
  { "enName": "Vietnamese", "originalName": "Tiếng Việt", "ietfTag": "vi-VN" }
];

export class LanguageChangeNotificator implements ILanguageChangeNotificator{

  private keeperCurrentLanguageTag: KeeperCurrentUserLanguage= new KeeperCurrentUserLanguage("CurrentLanguage", DEFAULT_LANG_DESCRIPTION.ietfTag);
  private subject: BehaviorSubject<ILanguageDescription>;
  selectionChanged$ : Observable<ILanguageDescription>;

  constructor() {
    const keepedLangTag = this.keeperCurrentLanguageTag.readCurrentLang();
    let currentLanguageDescription = this.getLanguageDescriptionForIetfTag(keepedLangTag);

    this.subject = new BehaviorSubject<ILanguageDescription>(currentLanguageDescription);
    this.selectionChanged$ = this.subject.asObservable();
  }

  selectionChanged(selectedLanguage: ILanguageDescription) {
    this.keeperCurrentLanguageTag.writeCurrentLang(selectedLanguage.ietfTag);
    this.subject.next(selectedLanguage);
  }

  private getLanguageDescriptionForIetfTag(ietfTag: string ): ILanguageDescription {
    if ((ietfTag == null) || (ietfTag == undefined)) return DEFAULT_LANG_DESCRIPTION;
    let res = SupportedLanguages.filter((lang) => lang.ietfTag == ietfTag)[0];
    if (res == undefined) return DEFAULT_LANG_DESCRIPTION;
    return res;
  }

}



