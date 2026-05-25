import React, { useState, useMemo } from 'react';
import { Folder, FolderOpen, FileCode, Search, Copy, Check, ShieldCheck, Database, Settings, HelpCircle, Code } from 'lucide-react';
import { AndroidFile, androidCodeProject } from '../codeFiles';

interface CodeWorkspaceProps {
  packageName: string;
  setPackageName: (name: string) => void;
}

export default function CodeWorkspace({ packageName, setPackageName }: CodeWorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(androidCodeProject[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Java Classes' | 'XML Layouts' | 'Config & Gradle' | 'MVVM Architecture'>('All');
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>({
    app: true,
    manifests: true,
    java: true,
    package: true,
    res: true,
    layout: true,
    gradle: true,
  });

  const toggleExpand = (node: string) => {
    setTreeExpanded(prev => ({ ...prev, [node]: !prev[node] }));
  };

  // Dynamically compile file content with adjusted custom package name
  const compiledContent = useMemo(() => {
    if (!selectedFile) return '';
    return selectedFile.content.replace(/com\.example\.bangla_ecommerce/g, packageName);
  }, [selectedFile, packageName]);

  // Copy code utility
  const handleCopy = () => {
    navigator.clipboard.writeText(compiledContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter files by tab selection and search query
  const filteredFiles = useMemo(() => {
    return androidCodeProject.filter(file => {
      const matchTab = activeTab === 'All' || file.category === activeTab;
      const matchSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          file.path.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  // Custom descriptions in English explaining Android components
  const fileExplanations: Record<string, string> = {
    'AndroidManifest.xml': 'The core configuration file of the Android application. It declares permissions like internet access, storage access, Firebase event service, and splash screens for all activities. It is essential for compiling and launching the app.',
    'build.gradle (Module: app)': 'The gradle build dependency file of the app module. It contains modern dependencies such as Firebase BoM, Firebase Security Authentication, Firestore database, Cloud Storage, Glide for real-time image rendering, shimmer loading effects, Lottie animations, and custom rounded image views.',
    'Product.java': 'The Model class in the MVVM architecture. It contains getter/setter methods and an empty constructor required for parsing documents from Firestore. It also defines custom domain business logic in Java to calculate discount percentage rates.',
    'ProductRepository.java': 'The data repository source class that handles queries, loads data, and manages filters using the Firebase Firestore SDK. It encapsulates direct read, write, and delete transactions in Firestore, passing high-level clean outcomes to ViewModels.',
    'HomeViewModel.java': 'The LiveData ViewModel class for the Home screen. It acts as an architectural link bridging the Repository data layers to the UI views, abstracting direct Firestore network interfaces from the Activities and dispatching real-time updates.',
    'ProductAdapter.java': 'A custom RecyclerView Adapter for high-performance product listings. It renders clean card grid items, leverages Glide for fast image loading, manages RAM caches, and binds contextual badges (such as Discount Rates and Out of Stock warnings) dynamically.',
    'MainActivity.java': 'The primary main dashboard screen or entry Activity of the app. It embeds a BottomNavigationView component, handles smooth slide / fade animations, and implements a security route guard to automatically redirect unauthenticated users to the Login page.',
    'activity_main.xml': 'The dashboard XML layout built via CoordinatorLayout and ConstraintLayout architectures. It houses the bottom navigating rails and hosts a FrameLayout box to load context fragments adaptively across variable phone resolution ratios.',
    'fragment_home.xml': 'The core home fragment layout XML. Features an elegant AppBar widget, custom search frames, a ViewPager2 slider for promotional banners, a HorizontalScrollView container for product chips, and a 2-column RecyclerView for grid listings.',
    'item_product.xml': 'The CardView template representing individual goods/products inside the grids. Styles complete rounded parameters, drop shadows, rating bars, markdown prices, and badge selectors, rendering a premium, production-ready aesthetic look.',
    'CheckoutActivity.java': 'The Java business logic for the checkout view. Validates vital user inputs (such as phone numbers, emails, and shipping addresses), calculates grand totals, registers orders into Firestore, and wipes the active cart on success.',
    'firestore.rules': 'The Firebase Security Rules configuration. Hardens data leaks by restricting generic users to reading or compiling their own baskets / orders, and validating permission levels so that only authenticated admin scopes can add, edit, or remove catalog inventory.'
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-full font-sans">
      
      {/* Configuration Header Area */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-[#3DDC84]" />
          <h2 className="text-sm font-semibold text-slate-200">Android SDK Setup & Config Properties</h2>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Package Name:</label>
          <input 
            type="text" 
            placeholder="com.example.bangla_ecommerce"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value.replace(/[^a-zA-Z0-9._]/g, ''))}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-[#3DDC84] font-mono tracking-wider focus:outline-none focus:border-[#3DDC84]"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden min-h-[500px]">
        
        {/* Sub-Panel 1: Android Studio Project File Explorer */}
        <div className="w-full md:w-64 bg-slate-950/70 p-3 flex flex-col overflow-y-auto">
          <div className="mb-3 relative shrink-0">
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-[#3DDC84]"
            />
            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
          </div>

          <div className="flex-1 text-xs space-y-1 select-none font-mono">
            {/* Standard root node */}
            <div className="text-[#8AB4F8] font-bold pb-2 flex items-center gap-1.5 border-b border-slate-900 mb-2">
              <Code size={14} />
              <span>Android Studio Project IDE</span>
            </div>

            {/* Folder - App */}
            <div>
              <div 
                onClick={() => toggleExpand('app')}
                className="flex items-center gap-1.5 py-1 text-slate-300 hover:text-white cursor-pointer px-1 rounded hover:bg-slate-900"
              >
                {treeExpanded.app ? <FolderOpen size={13} className="text-yellow-500" /> : <Folder size={13} className="text-yellow-600" />}
                <span className="font-semibold text-slate-200">app</span>
              </div>

              {treeExpanded.app && (
                <div className="pl-4 border-l border-slate-900/60 ml-2 space-y-1">
                  
                  {/* Manifests category */}
                  <div>
                    <div 
                      onClick={() => toggleExpand('manifests')}
                      className="flex items-center gap-1.5 py-0.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {treeExpanded.manifests ? <FolderOpen size={12} /> : <Folder size={12} />}
                      <span>manifests</span>
                    </div>
                    {treeExpanded.manifests && (
                      <div className="pl-4">
                        {androidCodeProject.filter(f => f.name === 'AndroidManifest.xml').map(file => (
                          <div 
                            key={file.name}
                            onClick={() => setSelectedFile(file)}
                            className={`flex items-center gap-1 py-1 px-1.5 rounded cursor-pointer ${
                              selectedFile.name === file.name 
                                ? 'bg-[#3DDC84]/15 text-[#3DDC84] border-l-2 border-[#3DDC84] font-medium' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                            }`}
                          >
                            <FileCode size={11} className={selectedFile.name === file.name ? 'text-[#3DDC84]' : 'text-slate-500'} />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Java Directory */}
                  <div>
                    <div 
                      onClick={() => toggleExpand('java')}
                      className="flex items-center gap-1.5 py-0.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {treeExpanded.java ? <FolderOpen size={12} /> : <Folder size={12} />}
                      <span>java</span>
                    </div>
                    {treeExpanded.java && (
                      <div className="pl-3 border-l border-slate-900/60 ml-1.5 space-y-1">
                        <div 
                          onClick={() => toggleExpand('package')}
                          className="flex items-center gap-1 py-0.5 text-slate-400 cursor-pointer"
                        >
                          {treeExpanded.package ? <FolderOpen size={11} /> : <Folder size={11} />}
                          <span className="text-[10px] text-yellow-600/85 font-mono truncate">{packageName}</span>
                        </div>
                        {treeExpanded.package && (
                          <div className="pl-3 space-y-1">
                            {androidCodeProject.filter(f => f.category === 'Java Classes' || f.category === 'MVVM Architecture').map(file => (
                              <div 
                                key={file.name}
                                onClick={() => setSelectedFile(file)}
                                className={`flex items-center gap-1 py-1 px-1.5 rounded cursor-pointer ${
                                  selectedFile.name === file.name 
                                    ? 'bg-[#3DDC84]/15 text-[#3DDC84] border-l-2 border-[#3DDC84] font-medium' 
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                }`}
                              >
                                <FileCode size={11} className={selectedFile.name === file.name ? 'text-[#3DDC84]' : 'text-slate-500'} />
                                <span className="truncate">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Res Layouts Directory */}
                  <div>
                    <div 
                      onClick={() => toggleExpand('res')}
                      className="flex items-center gap-1.5 py-0.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {treeExpanded.res ? <FolderOpen size={12} /> : <Folder size={12} />}
                      <span>res</span>
                    </div>
                    {treeExpanded.res && (
                      <div className="pl-3 border-l border-slate-900/60 ml-1.5 space-y-1">
                        <div 
                          onClick={() => toggleExpand('layout')}
                          className="flex items-center gap-1 py-0.5 text-slate-400 cursor-pointer"
                        >
                          {treeExpanded.layout ? <FolderOpen size={11} /> : <Folder size={11} />}
                          <span>layout</span>
                        </div>
                        {treeExpanded.layout && (
                          <div className="pl-3 space-y-1">
                            {androidCodeProject.filter(f => f.category === 'XML Layouts').map(file => (
                              <div 
                                key={file.name}
                                onClick={() => setSelectedFile(file)}
                                className={`flex items-center gap-1 py-1 px-1.5 rounded cursor-pointer ${
                                  selectedFile.name === file.name 
                                    ? 'bg-[#3DDC84]/15 text-[#3DDC84] border-l-2 border-[#3DDC84] font-medium' 
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                }`}
                              >
                                <FileCode size={11} className={selectedFile.name === file.name ? 'text-[#3DDC84]' : 'text-slate-500'} />
                                <span className="truncate">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Config & Rules Node (Gradle Scripts) */}
            <div>
              <div 
                onClick={() => toggleExpand('gradle')}
                className="flex items-center gap-1.5 py-1 text-slate-300 hover:text-white cursor-pointer px-1 rounded hover:bg-slate-900"
              >
                {treeExpanded.gradle ? <FolderOpen size={13} className="text-cyan-500" /> : <Folder size={13} className="text-cyan-600" />}
                <span className="font-semibold text-slate-200">Gradle & Security Config</span>
              </div>

              {treeExpanded.gradle && (
                <div className="pl-4 ml-2 space-y-1">
                  {androidCodeProject.filter(f => f.category === 'Config & Gradle' && f.name !== 'AndroidManifest.xml').map(file => (
                    <div 
                      key={file.name}
                      onClick={() => setSelectedFile(file)}
                      className={`flex items-center gap-1 py-1 px-1.5 rounded cursor-pointer ${
                        selectedFile.name === file.name 
                          ? 'bg-[#3DDC84]/15 text-[#3DDC84] border-l-2 border-[#3DDC84] font-medium' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                      }`}
                    >
                      <FileCode size={11} className={selectedFile.name === file.name ? 'text-[#3DDC84]' : 'text-slate-500'} />
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Quick Info Box underneath tree */}
          <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 hidden md:block">
            <h4 className="text-[10px] uppercase tracking-wider text-[#3DDC84] font-semibold flex items-center gap-1.5">
              <Database size={11} />
              <span>Firebase Connected</span>
            </h4>
            <p className="text-[10px] text-slate-400 leading-normal font-sans">
              All source code files utilize Firebase Firestore, Authentication, and Storage SDKs, ensuring full database synchronization for the e-commerce structure.
            </p>
          </div>
        </div>

        {/* Sub-Panel 2: Code Viewer & Tab Filters */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Filtering tabs */}
          <div className="p-2.5 bg-slate-900/60 border-b border-slate-800 flex flex-wrap gap-1">
            {(['All', 'Java Classes', 'XML Layouts', 'Config & Gradle', 'MVVM Architecture'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // Auto-switch file to first filtered if needed
                  const available = androidCodeProject.filter(f => tab === 'All' || f.category === tab);
                  if (available.length > 0 && !available.includes(selectedFile)) {
                    setSelectedFile(available[0]);
                  }
                }}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  activeTab === tab 
                    ? 'bg-slate-800 text-[#3DDC84] font-semibold shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab === 'All' ? 'All Files' : tab === 'Java Classes' ? 'Java Classes' : tab === 'XML Layouts' ? 'XML Layouts' : tab === 'Config & Gradle' ? 'Gradle & Configs' : 'MVVM Architecture'}
              </button>
            ))}
          </div>

          {/* Selected File header */}
          <div className="p-3 bg-slate-950 border-b border-slate-900 flex justify-between items-center shrink-0">
            <div>
              <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
                {selectedFile.path.replace(/com\.example\.bangla_ecommerce/g, packageName)}
              </span>
              <h3 className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5 font-mono">
                <span>{selectedFile.name}</span>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                  selectedFile.language === 'java' ? 'bg-[#EC6C3D]/10 text-[#EC6C3D] border border-[#EC6C3D]/20' :
                  selectedFile.language === 'xml' ? 'bg-[#3C79E6]/10 text-[#3C79E6] border border-[#3C79E6]/20' :
                  'bg-yellow-500/10 text-yellow-500 border border-yellow-500/10'
                }`}>
                  {selectedFile.language}
                </span>
              </h3>
            </div>
            
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-[#3DDC84]/15 border border-slate-800 hover:border-[#3DDC84]/30 rounded-lg py-1.5 px-3 text-xs text-slate-300 hover:text-[#3DDC84] transition-all font-display"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-[#3DDC84]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* CODE SCROLL AREA */}
          <div className="flex-1 overflow-auto p-4 bg-[#0B0F19] text-xs font-mono relative">
            <pre className="text-slate-300 leading-relaxed font-mono whitespace-pre overflow-x-auto selection:bg-[#3DDC84]/30">
              <code>
                {compiledContent.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row">
                    <span className="table-cell text-right pr-4 text-slate-600 select-none text-[10px] w-8">{idx + 1}</span>
                    <span className="table-cell">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>

          {/* BENGALI EXPLORATION AND EDUCATION ASSISTANCE FOOTER */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-start gap-3">
            <div className="bg-[#3DDC84]/10 p-2 rounded-lg text-[#3DDC84] shrink-0">
              <HelpCircle size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-200 font-display">Developer Assistance Guide</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {fileExplanations[selectedFile.name] || 'An essential Android project configuration file that manages runtime e-commerce transactions.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
