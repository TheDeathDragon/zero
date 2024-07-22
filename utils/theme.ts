import type { Theme } from '@/type'
import Ayaka from '@/assets/images/ayaka.jpg'
import Beelzebul from '@/assets/images/beelzebul.jpg'
import Ganyu from '@/assets/images/ganyu.jpg'
import Hutao from '@/assets/images/hutao.jpg'
import Kokomi from '@/assets/images/kokomi.jpg'
import Nahida from '@/assets/images/nahida.jpg'
import Nilou from '@/assets/images/nilou.jpg'
import Yoimiya from '@/assets/images/yoimiya.jpg'

const themeList: Theme[] = [
  {
    type: 'Hutao',
    name: '雪霁梅香',
    description: '幽蝶留芳之处',
    color: {
      primary: '#E06458',
      background: '#FCFAF2',
    },
    image: Hutao,
  },
  {
    type: 'Nahida',
    name: '白草净华',
    description: '如风如露之思',
    color: {
      primary: '#7EA08A',
      background: '#F3F7F2',
    },
    image: Nahida,
  },
  {
    type: 'Nilou',
    name: '浮莲舞步',
    description: '四时旋舞之熙',
    color: {
      primary: '#74B5DB',
      background: '#DBEAF1',
    },
    image: Nilou,
  },

  {
    type: 'Ganyu',
    name: '循循守月',
    description: '仙泽麟行之迹',
    color: {
      primary: '#5260A6',
      background: '#E2E5F5',
    },
    image: Ganyu,
  },
  {
    type: 'Kokomi',
    name: '真珠之智',
    description: '浮岳映虹之波',
    color: {
      primary: '#BF9997',
      background: '#F2E1DC',
    },
    image: Kokomi,
  },

  {
    type: 'Ayaka',
    name: '白鹭霜华',
    description: '白鹭儃伫之思',
    color: {
      primary: '#8996B2',
      background: '#D8E2EC',
    },
    image: Ayaka,
  },
  {
    type: 'Yoimiya',
    name: '琉焰华舞',
    description: '硝彩盛放之光',
    color: {
      primary: '#C15C42',
      background: '#F3E8DB',
    },
    image: Yoimiya,
  },
  {
    type: 'Beelzebul',
    name: '一心净土',
    description: '天光澄寂之景',
    color: {
      primary: '#8C78B0',
      background: '#E3DBED',
    },
    image: Beelzebul,
  },
]

export default themeList
