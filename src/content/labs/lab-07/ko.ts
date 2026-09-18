import type { Lab07LocalePack } from './locales.ts'

export const lab07Ko: Lab07LocalePack = {
  title: 'Copilot Studio Apps (Preview)에서 MRM 앱 만들기',
  summary: 'Copilot Studio Apps (Preview)에서 GitHub Copilot harness를 사용해 자연어로 현대적인 마케팅 리소스 관리(MRM) 애플리케이션을 만들고, 생성된 코드를 살펴본 뒤 확장하여 게시합니다.',
  outcome: '예산 계획, 비용 추적, 마케팅 활동, 리소스 관리, 라이트/다크 테마 전환 기능을 갖춘 Marketing Resource Hub - <Your Alias>라는 이름의 게시된 관리형 앱.',
  objectives: [
    'Copilot Studio Apps (Preview)를 열고 GitHub Copilot harness를 사용해 새 앱을 만듭니다.',
    '자세한 자연어 요청으로 마케팅 리소스 관리(MRM) 앱을 생성하고, 생성 진행 상황을 실시간으로 살펴봅니다.',
    'Preview와 Code 모드를 비교하고 라이트/다크 테마 전환 기능을 추가한 다음 앱을 Save하고 Publish합니다.',
  ],
  prerequisites: [
    'Maker 계정에서 Apps (Preview)와 GitHub Copilot harness가 활성화된 Copilot Studio 환경.',
    '해당 환경에서 앱을 만들고 Publish할 수 있는 권한. Preview 사용 시 Copilot Credits가 소진될 수 있으며 Preview 약관이 적용됩니다.',
  ],
  stepTitles: {
    'open-apps-preview': 'Copilot Studio Apps (Preview) 열기',
    'describe-mrm-app': 'MRM 앱 설명하기',
    'build-and-explore': '빌드 과정을 지켜보고 Preview와 Code 살펴보기',
    'enhance-theme': '테마 전환으로 앱 개선하기',
    'save-and-publish': '이름을 바꾸고 Save한 뒤 Publish하기',
  },
  pageTitles: {
    'build-and-explore/watch-generation': '앱이 만들어지는 모습 보기',
    'build-and-explore/preview-and-code': 'Preview와 Code 모드 살펴보기',
  },
  paragraphs: {
    'open-apps-preview/main': ['Copilot Studio Home 페이지에서 시작하거나, 테넌트에서 Apps 항목이 아직 보이지 않으면 Preview 직접 URL을 사용하세요.'],
    'describe-mrm-app/main': ['하나의 결과 중심 프롬프트로 앱 범위, 사용자, 네 가지 핵심 업무 기능을 harness에 전달하세요.'],
    'build-and-explore/watch-generation': ['GitHub Copilot harness가 요구 사항을 해석하여 실행 가능한 현대적인 앱으로 바꾸는 과정을 관찰하세요.'],
    'build-and-explore/preview-and-code': ['Preview에서 생성된 앱을 테스트한 다음, Code 모드에서 작동하는 경험이 어떻게 만들어지고 갱신되는지 살펴보세요.'],
    'enhance-theme/main': ['같은 대화를 계속 사용하고 harness에 완전한 라이트/다크 테마 경험을 추가해 달라고 요청하세요.'],
    'save-and-publish/main': ['앱에 워크숍에서 구분할 수 있는 고유한 이름을 부여하고, 생성된 작업을 저장한 뒤 검증된 버전을 게시하세요.'],
  },
  markdown: {
    'open-apps-preview/main': `## Copilot Studio Apps (Preview) 열기
1. **Copilot Studio**를 열고 진행자가 할당한 환경에서 작업 중인지 확인합니다.
2. **Home** 페이지에서 **Apps (Preview)**를 찾아 선택합니다.
3. Apps 항목이 보이지 않으면 새 탭에서 Preview를 직접 엽니다: **https://aka.ms/app-studio/preview**
4. **GitHub Copilot harness**를 사용하여 새 앱을 만드는 옵션을 선택합니다.
5. 이 브라우저 탭은 실습이 끝날 때까지 열어 둡니다.

> **Preview 참고:** 체험, 레이블, 배치는 변경될 수 있습니다. UI가 이 안내와 다르면 의미가 가장 가까운 옵션을 선택하세요.`,
    'describe-mrm-app/main': `## 마케팅 리소스 관리 앱 설명하기
1. 자연어 입력란에 아래에 제공된 앱 요청을 붙여 넣습니다.
2. 요청을 제출합니다.
3. Copilot Studio가 확인 질문을 하면 첫 번째 버전은 다음 네 가지 영역에 집중하도록 합니다:
   - **예산 및 계획** — 캠페인을 계획하고 마케팅 예산을 배분합니다.
   - **비용 추적** — 예정 지출과 실제 지출을 기록합니다.
   - **마케팅 활동** — 캠페인, 활동, 채널, 산출물을 정리합니다.
   - **시간 및 리소스 관리** — 담당자, 작업량, 날짜, 상태를 할당합니다.
4. 빌드를 승인하기 전에 제안된 계획이나 가정을 검토합니다.
5. 빌드를 시작하고 나중에 앱을 다듬을 수 있도록 대화는 계속 열어 둡니다.

비즈니스 성과와 사용자가 구체적일수록 생성되는 정보 아키텍처와 경험이 더 유용해집니다.`,
    'build-and-explore/watch-generation': `## GitHub Copilot harness가 앱을 빌드하는 과정 지켜보기
1. Copilot Studio가 요청을 해석하고 앱을 만드는 동안 진행 메시지를 확인합니다.
2. MRM 시나리오가 페이지, 내비게이션, 컴포넌트, 상호작용, 데이터 개념으로 분해되는 방식을 살펴봅니다.
3. 첫 번째 완성본에는 보통 약 **10–15분**이 걸립니다. 빌드 시간은 달라질 수 있습니다.
4. 생성이 진행되는 동안 페이지를 새로 고치거나 닫지 마세요.
5. harness가 연결, 테이블 또는 기타 리소스의 승인을 요청하면 승인하기 전에 요청 내용을 읽습니다.
6. 생성이 끝나면 오른쪽 Preview 영역에 현대적인 앱이 표시되는지 확인합니다.

생성은 반복적으로 진행됩니다. 사용할 수 있는 첫 번째 버전은 출발점일 뿐 최종 디자인은 아닙니다.

## 생성된 앱을 자유롭게 탐색하기
첫 번째 버전이 준비되면 최종 사용자처럼 생성된 앱의 아무 곳이나 클릭하며 자유롭게 둘러보세요.

- 내비게이션을 사용해 MRM 작업 영역 사이를 이동합니다.
- 사용 가능한 마케팅 리소스 레코드를 필터링하고 정렬합니다.
- 레코드를 선택하고 상세 폼으로 드릴다운합니다.
- 새 마케팅 계획 또는 예산을 만들고 생성된 필드와 경험을 검토합니다.
- 다양한 유형의 마케팅 리소스 레코드를 편집하고 변경 사항이 앱에 반영되는지 확인합니다.
- 메인 보기로 돌아가 다른 사용 가능한 작업도 계속 탐색합니다.

워크숍 또는 샘플 데이터만 사용하세요. 이 단계의 목표는 코드를 살펴보기 전에 생성된 앱의 내비게이션, 폼, 필터링, 레코드 관리 경험을 이해하는 것입니다.`,
    'build-and-explore/preview-and-code': `## Preview와 Code 모드 살펴보기
1. **Preview**에서 생성된 경험을 따라가며 다음 주요 MRM 작업 영역을 찾습니다:
   - 예산 및 계획
   - 비용 추적
   - 마케팅 활동
   - 시간 및 리소스 관리
2. 핵심 상호작용을 시도하고 제공되는 빈 상태, 로딩 상태, 데이터가 채워진 상태를 살펴봅니다.
3. **Code** 모드로 전환해 애플리케이션이 런타임에 어떻게 생성되는지 확인합니다.
4. harness가 변경을 적용하는 동안 **Preview**와 **Code**를 오가며 소스와 렌더링된 경험이 계속 동기화되는지 확인합니다.
5. **Preview**로 돌아가 앱이 데스크톱 폭과 좁은 폭 모두에서 정상적으로 사용되는지 확인합니다.

이 실습에서는 생성된 소스를 직접 편집할 필요가 없습니다. 목표는 자연어 변경이 어떻게 동작하는 애플리케이션 코드로 바뀌는지 이해하는 것입니다.`,
    'enhance-theme/main': `## 라이트/다크 테마 전환 추가하기
1. 자연어 대화로 돌아갑니다.
2. 아래에 제공된 개선 요청을 붙여 넣습니다.
3. 요청을 제출하고 harness가 영향을 받는 UI와 코드를 식별하는 과정을 지켜봅니다.
4. 업데이트가 완료되면 **Preview**에서 새 테마 컨트롤을 찾습니다.
5. 라이트 테마와 다크 테마를 전환하면서 텍스트, 내비게이션, 폼, 차트, 상태 색상이 모두 읽기 쉬운지 확인합니다.
6. **Code**로 전환해 생성된 변경 사항을 살펴본 다음 최종 확인을 위해 **Preview**로 돌아갑니다.

향후 향상 작업에도 같은 반복 방식을 사용할 수 있습니다. 먼저 새로운 경험을 요청하고, 앱에 실제 비즈니스 데이터가 필요할 때 승인된 연결과 데이터 테이블을 추가하세요.`,
    'save-and-publish/main': `## 이름을 바꾸고 Save한 뒤 Publish하기
1. 앱 세부 정보나 이름 바꾸기 명령을 엽니다.
2. 앱 이름을 **Marketing Resource Hub - <Your Alias>**로 변경합니다.
3. **Save**를 선택하고 저장 작업이 끝날 때까지 기다립니다.
4. 최종 Preview를 검토해 네 개의 MRM 영역과 테마 전환이 계속 정상 동작하는지 확인합니다.
5. **Publish**를 선택합니다. Preview 환경의 레이블이 **Save and publish**라면 해당 옵션을 선택합니다.
6. 성공 확인이 표시될 때까지 기다린 뒤 페이지를 떠납니다.
7. Copilot Studio에서 게시된 앱을 다시 열고 게시된 이름과 경험을 확인합니다.

게시하면 현재 저장된 버전이 환경에서 지원하는 채널과 권한을 통해 사용할 수 있게 됩니다. Preview 및 평가판 기능은 테넌트에 따라 다를 수 있습니다.`,
  },
  highlights: {
    'open-apps-preview/main': 'Home 페이지에서 Apps를 찾지 못하면 https://aka.ms/app-studio/preview 를 직접 여세요. 이 체험은 Preview이므로 레이블과 레이아웃이 바뀔 수 있습니다.',
    'describe-mrm-app/main': '첫 빌드는 범위를 좁게 유지하세요. 이해한 계획과 리소스만 승인하고, 그다음에는 작고 검증 가능한 요청으로 경험을 다듬으세요.',
    'build-and-explore/watch-generation': '첫 완성본은 보통 10–15분 정도 걸립니다. 세션을 열어 둔 채 진행 메시지를 보며 harness가 무엇을 만드는지 파악하세요.',
    'build-and-explore/preview-and-code': 'Preview는 사용자 경험을 검증하고 Code 모드는 생성된 구현을 보여 줍니다. 둘을 오가며 자연어 의도를 최종 앱과 연결하세요.',
    'enhance-theme/main': '모든 향상은 검증 가능한 변경으로 다루세요. 한 번에 한 기능만 요청하고, 무엇이 바뀌는지 확인한 다음 다음 기능을 요청하기 전에 Preview에서 검증합니다.',
    'save-and-publish/main': '명시적인 Save 및 Publish 완료 확인을 기다리세요. 보기에는 올바른 Preview와 실제로 성공적으로 Publish된 앱은 다릅니다.',
  },
  promptTitles: {
    'lab07-preview-url': 'Apps (Preview) 바로가기 URL',
    'lab07-mrm-app-prompt': 'MRM 앱 요청',
    'lab07-theme-prompt': '테마 전환 요청',
    'lab07-app-name': '최종 앱 이름',
  },
}
