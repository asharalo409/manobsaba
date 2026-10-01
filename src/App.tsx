import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { RoomTabsNav } from './components/RoomTabsNav';
import { DigitalClockBar } from './components/DigitalClockBar';
import { HomeOverview } from './components/HomeOverview';
import { ProjectsSection } from './components/ProjectsSection';
import { NoticesSection } from './components/NoticesSection';
import { MultiCalendarSection } from './components/MultiCalendarSection';
import { BloodBankSection } from './components/BloodBankSection';
import { FinancialsAndToolsSection } from './components/FinancialsAndToolsSection';
import { MediaLibrarySection } from './components/MediaLibrarySection';
import { ComplaintCenterSection } from './components/ComplaintCenterSection';
import { MembersDirectory } from './components/MembersDirectory';
import { ChatSection } from './components/ChatSection';
import { MyProfileRoom } from './components/MyProfileRoom';
import { DonationModal } from './components/DonationModal';
import { InvoiceReceiptModal } from './components/InvoiceReceiptModal';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('home');

  const go = (t: string) => {
    setActiveTab(t);
    window.scrollTo({ top: 0 });
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsSection />;
      case 'notices': return <NoticesSection />;
      case 'calendar': return <MultiCalendarSection />;
      case 'blood': return <BloodBankSection />;
      case 'finance': return <FinancialsAndToolsSection />;
      case 'media': return <MediaLibrarySection />;
      case 'complaints': return <ComplaintCenterSection />;
      case 'members': return <MembersDirectory />;
      case 'chat': return <ChatSection />;
      case 'profile': return <MyProfileRoom />;
      default: return <HomeOverview setActiveTab={go} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DigitalClockBar />
      <Navbar setActiveTab={go} />
      <RoomTabsNav activeTab={activeTab} setActiveTab={go} />
      <main className="flex-1">{renderActiveSection()}</main>
      <Footer setActiveTab={go} />

      <DonationModal />
      <InvoiceReceiptModal />
      <LoginModal />
      <SettingsModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
