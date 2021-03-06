import {
  MachineTranslatePayload,
  MachineTranslateResult,
  SearchFunction,
  GetSrcPageFunction
} from '../helpers'
import {
  isContainChinese,
  isContainJapanese,
  isContainKorean
} from '@/_helpers/lang-check'
import { Sogou } from '@opentranslate/sogou'
import { SogouLanguage } from './config'

let _translator: Sogou | undefined
const getTranslator = () =>
  (_translator = _translator || new Sogou({ env: 'ext' }))

export const getSrcPage: GetSrcPageFunction = (text, config, profile) => {
  const lang =
    profile.dicts.all.sogou.options.tl === 'default'
      ? config.langCode === 'zh-CN'
        ? 'zh-CHS'
        : config.langCode === 'zh-TW'
        ? 'zh-CHT'
        : 'en'
      : profile.dicts.all.sogou.options.tl

  return `https://fanyi.sogou.com/#auto/${lang}/${text}`
}

export type SogouResult = MachineTranslateResult<'sogou'>

export const search: SearchFunction<
  SogouResult,
  MachineTranslatePayload<SogouLanguage>
> = async (text, config, profile, payload) => {
  const options = profile.dicts.all.sogou.options

  const sl = payload.sl || 'auto'
  const tl =
    payload.tl ||
    (options.tl === 'default'
      ? config.langCode === 'en'
        ? 'en'
        : !isContainChinese(text) ||
          isContainJapanese(text) ||
          isContainKorean(text)
        ? config.langCode === 'zh-TW'
          ? 'zh-TW'
          : 'zh-CN'
        : 'en'
      : options.tl)

  if (payload.isPDF && !options.pdfNewline) {
    text = text.replace(/\n+/g, ' ')
  }

  const translator = getTranslator()

  try {
    const result = await translator.translate(text, sl, tl)
    return {
      result: {
        id: 'sogou',
        sl: result.from,
        tl: result.to,
        langcodes: translator.getSupportLanguages(),
        searchText: result.origin,
        trans: result.trans
      },
      audio: {
        us: result.trans.tts
      }
    }
  } catch (e) {
    return {
      result: {
        id: 'sogou',
        sl,
        tl,
        langcodes: translator.getSupportLanguages(),
        searchText: { paragraphs: [''] },
        trans: { paragraphs: [''] }
      }
    }
  }
}
