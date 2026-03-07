/**
 * Endings Engine - Ending determination logic + satirical quotes
 */
const EndingsEngine = (() => {
  const QUOTES = [
    '모멘텀은 해자가 아니다. 프로덕트가 해자다.',
    'VC가 \'프로덕트는 나중에 만들면 된다\'고 하면, 그 나중은 영원히 오지 않는다.',
    'ARR 300% 성장? DAU 3명에서 12명 되는 것도 300%다.',
    'rage-bait의 유통기한은 2주다. 프로덕트의 유통기한은 무한이다.',
    '절벽에서 떨어지면서 비행기를 조립하라. 단, 비행기 부품이 있는지는 먼저 확인하라.',
    '바이럴은 전략이 될 수 있다. 전략만이 전략일 순 없다.',
    '실리콘밸리에서 가장 위험한 문장: \'DD는 나중에 해도 된다.\'',
    '크리에이터 60명, 편집자 700명, 엔지니어 5명. 이 비율이 회사의 운명을 말해준다.',
    '22세에 $20M을 받았다. 문제는 $20M의 무게를 견딜 어깨가 있느냐다.',
    '투자자의 FOMO는 창업자의 무기다. 다만 무기는 주인도 벨 수 있다.',
    '고백은 용기다. 고백에도 거짓말을 섞는 건 습관이다.',
    '실패하면 사기, 성공하면 비전. 문제는 이걸 결정하는 건 본인이 아니라 시장이다.',
  ];

  // ===== FOUNDER ENDINGS (5) =====
  const FOUNDER_ENDINGS = [
    {
      id: 'f_scammer',
      emoji: '🎭',
      name: '사기꾼',
      description: '실패하면 사기. 당신은 실패했다.',
      check: (stats, flags) => {
        if (stats.credibility <= 0) return true;
        if (flags.includes('confession') && flags.includes('ending_hustle')) return true;
        return false;
      },
      priority: 100,
    },
    {
      id: 'f_visionary',
      emoji: '⚡',
      name: '비저너리',
      description: '성공하면 비전. 당신은 성공했다. 이번엔 진짜로.',
      check: (stats, flags) => {
        return flags.includes('ending_product') && stats.product >= 40;
      },
      priority: 90,
    },
    {
      id: 'f_serial_hustler',
      emoji: '🚀',
      name: '시리얼 허슬러',
      description: '첫 번째는 연습이었다. 진짜는 지금부터다. ...맞겠지?',
      check: (stats, flags) => {
        return flags.includes('ending_serial') && stats.hype >= 60;
      },
      priority: 85,
    },
    {
      id: 'f_rebuilder',
      emoji: '🔧',
      name: '리빌더',
      description: '무너진 자리에서 다시 쌓는 중. 이번엔 기초부터.',
      check: (stats, flags) => {
        return flags.includes('ending_rebuild') && stats.credibility >= 50;
      },
      priority: 80,
    },
    {
      id: 'f_one_hit_wonder',
      emoji: '🌊',
      name: '원히트원더',
      description: '15분의 명성. 타이머가 울렸다.',
      check: (stats, flags) => {
        return true; // fallback
      },
      priority: 0,
    },
  ];

  // Additional checks for nuanced endings
  function getFounderEnding(stats, flags) {
    // Special: game over by credibility = 0
    if (stats.credibility <= 0) {
      return FOUNDER_ENDINGS.find(e => e.id === 'f_scammer');
    }

    // ending_product path
    if (flags.includes('ending_product')) {
      if (stats.product >= 40) {
        return FOUNDER_ENDINGS.find(e => e.id === 'f_visionary');
      } else {
        return {
          id: 'f_too_late_pivot',
          emoji: '⏰',
          name: '너무 늦은 피봇',
          description: '프로덕트를 만들겠다는 결심은 좋았다. 다만 시작이 너무 늦었다.',
        };
      }
    }

    // ending_serial path
    if (flags.includes('ending_serial')) {
      if (stats.hype >= 60) {
        return FOUNDER_ENDINGS.find(e => e.id === 'f_serial_hustler');
      } else {
        return FOUNDER_ENDINGS.find(e => e.id === 'f_one_hit_wonder');
      }
    }

    // ending_rebuild path
    if (flags.includes('ending_rebuild')) {
      if (stats.credibility >= 50) {
        return FOUNDER_ENDINGS.find(e => e.id === 'f_rebuilder');
      } else {
        return {
          id: 'f_trust_bankrupt',
          emoji: '📉',
          name: '신뢰 파산',
          description: '솔직하려 했지만, 이미 너무 많은 것을 잃었다.',
        };
      }
    }

    // ending_hustle path
    if (flags.includes('ending_hustle')) {
      if (flags.includes('confession')) {
        return FOUNDER_ENDINGS.find(e => e.id === 'f_scammer');
      }
      if (stats.hype >= 70) {
        return {
          id: 'f_endless_hustle',
          emoji: '♾️',
          name: '끝없는 허슬',
          description: '멈출 수 없다. 멈추면 무너진다. 그래서 오늘도 달린다.',
        };
      }
    }

    // Default fallback
    return FOUNDER_ENDINGS.find(e => e.id === 'f_one_hit_wonder');
  }

  // ===== VC ENDINGS (5) =====
  const VC_ENDINGS = [
    {
      id: 'v_reputation_crash',
      emoji: '📉',
      name: '평판 하락',
      description: 'LP가 전화를 안 받는다. 이것이 대답이다.',
    },
    {
      id: 'v_growing_investor',
      emoji: '🔍',
      name: '성장하는 투자자',
      description: '$15M의 수업료. 비싸지만 값어치 있는 교훈.',
    },
    {
      id: 'v_silent_survivor',
      emoji: '🛡️',
      name: '묵묵한 서바이버',
      description: '올해도 살아남았다. VC는 장기전이다.',
    },
    {
      id: 'v_all_in_vc',
      emoji: '🎲',
      name: '올인 VC',
      description: '틀릴 수 있다. 하지만 베팅을 멈추면 VC가 아니다.',
    },
    {
      id: 'v_evolving_vc',
      emoji: '🧬',
      name: '진화하는 VC',
      description: '모멘텀은 해자가 아니었다. 하지만 그걸 배우는 데 $15M이 들었다.',
    },
  ];

  function getVCEnding(stats, flags) {
    // Game over by reputation = 0
    if (stats.reputation <= 0) {
      return VC_ENDINGS.find(e => e.id === 'v_reputation_crash');
    }

    // Special ending: evolving VC
    if (flags.includes('ending_evolve') &&
        flags.includes('momentum_thesis') &&
        flags.includes('questioned_revenue')) {
      return VC_ENDINGS.find(e => e.id === 'v_evolving_vc');
    }

    // ending_review path
    if (flags.includes('ending_review')) {
      if (stats.diligence >= 60) {
        return VC_ENDINGS.find(e => e.id === 'v_growing_investor');
      } else {
        return {
          id: 'v_late_reflection',
          emoji: '🪞',
          name: '늦은 반성',
          description: '복기 보고서를 썼다. 다만 그 보고서에 빠진 것이 있다: 자기 자신에 대한 반성.',
        };
      }
    }

    // ending_silent path
    if (flags.includes('ending_silent')) {
      if (stats.reputation >= 60) {
        return VC_ENDINGS.find(e => e.id === 'v_silent_survivor');
      } else {
        return VC_ENDINGS.find(e => e.id === 'v_reputation_crash');
      }
    }

    // ending_support path
    if (flags.includes('ending_support')) {
      if (stats.conviction >= 60) {
        return VC_ENDINGS.find(e => e.id === 'v_all_in_vc');
      } else {
        return {
          id: 'v_judgment_doubt',
          emoji: '❓',
          name: '판단력 의심',
          description: '확신 없이 서포트하는 건 충성이 아니라 관성이다.',
        };
      }
    }

    // ending_evolve path (without special condition)
    if (flags.includes('ending_evolve')) {
      return {
        id: 'v_philosophy_reset',
        emoji: '🔄',
        name: '철학 리셋',
        description: '투자 철학을 바꿨다. 새 철학이 맞을지는 또 다른 $15M이 증명할 것이다.',
      };
    }

    // Default
    return VC_ENDINGS.find(e => e.id === 'v_silent_survivor');
  }

  function determine(role, stats, flags) {
    const ending = role === 'founder'
      ? getFounderEnding(stats, flags)
      : getVCEnding(stats, flags);

    return {
      ...ending,
      quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
      stats: { ...stats },
      flags: [...flags],
      role,
    };
  }

  return { determine, QUOTES };
})();
