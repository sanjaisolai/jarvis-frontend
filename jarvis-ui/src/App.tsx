    import ChatPanel from './components/ChatPanel'
    import DynamicComponentList from './components/DynamicComponentList'
    import JarvisOrb from './components/JarvisOrb'
    // import TestDynamicUIButton from './components/TestDynamicUIButton'
    import { useJarvis } from './hooks/useJarvis'

    function App() {
    const {
        active,
        setActive,
        response,
        isThinking,
        uiComponents,
        setUiComponents,
    } = useJarvis()

    return (
        <div className="h-screen w-screen bg-transparent">
        <div className={`fixed inset-0 ${active ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <JarvisOrb active={active} onDeactivate={() => setActive(false)} />

            {active && (
            <ChatPanel response={response} isThinking={isThinking} />
            )}

            <DynamicComponentList components={uiComponents} setComponents={setUiComponents} />
            {/* <TestDynamicUIButton setUiComponents={setUiComponents} /> */}
        </div>
        </div>
    )
    }

    export default App
