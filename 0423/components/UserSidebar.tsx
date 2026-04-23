'use client';

// UserSidebar — Global UI State(Zustand)에서 selectedMenu를 직접 읽고 씀
// props로 내려주지 않아도 어느 컴포넌트에서든 참조 가능
import useUIStore from '@/store/uiStore';
import { MENU_GROUPS } from '@/lib/dashboardData';

export default function UserSidebar() {
  const selectedMenu = useUIStore((s) => s.selectedMenu);
  const setSelectedMenu = useUIStore((s) => s.setSelectedMenu);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-row">
        <div className="sidebar-logo-mark">
          <span className="mark-left"></span>
          <span className="mark-right"></span>
        </div>
        <h1 className="sidebar-logo-text">Smart Wms</h1>
      </div>

      <div className="sidebar-menu-wrap">
        {MENU_GROUPS.map((group) => (
          <section className="sidebar-group" key={group.title}>
            <h2 className="sidebar-group-title">{group.title}</h2>
            {group.items.map((item) => {
              const isActive = selectedMenu === item.label;
              const className =
                item.type === 'main'
                  ? isActive ? 'sidebar-menu active' : 'sidebar-menu'
                  : isActive ? 'sidebar-submenu active-submenu' : 'sidebar-submenu';
              return (
                <button
                  key={item.label}
                  type="button"
                  className={className}
                  onClick={() => setSelectedMenu(item.label)}
                >
                  <span className={item.type === 'main' ? 'sidebar-menu-icon' : 'sidebar-submenu-icon'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </section>
        ))}
      </div>
    </aside>
  );
}
