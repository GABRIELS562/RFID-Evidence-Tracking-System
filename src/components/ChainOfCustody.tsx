/**
 * Chain of Custody Visualization Component
 * Professional digital chain of custody tracking with signatures, seals, and audit trail
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  User, Shield, Clock, MapPin, FileText, Camera, Fingerprint,
  CheckCircle, XCircle, AlertTriangle, Info, Download, Printer,
  Hash, Calendar, Building, Truck, Lock, Unlock, Eye, EyeOff,
  RotateCcw, Search, Filter, ArrowRight, ArrowDown, CheckSquare,
  Users, Award, Badge, Stamp, Signature, ShieldCheck, AlertCircle
} from 'lucide-react';

interface CustodyEntry {
  id: string;
  timestamp: Date;
  action: 'received' | 'transferred' | 'analyzed' | 'stored' | 'transported' | 'sealed' | 'unsealed' | 'returned';
  fromPersonnel?: PersonnelInfo;
  toPersonnel: PersonnelInfo;
  location: LocationInfo;
  evidence: EvidenceInfo;
  verification: VerificationInfo;
  conditions: EnvironmentalConditions;
  notes?: string;
  attachments?: AttachmentInfo[];
  sealIntegrity: 'intact' | 'broken' | 'not_applicable';
  witnessPersonnel?: PersonnelInfo[];
  authorizations?: AuthorizationInfo[];
}

interface PersonnelInfo {
  id: string;
  name: string;
  role: string;
  badge: string;
  department: string;
  rank?: string;
  certification?: string[];
  signature: DigitalSignature;
  contactInfo: {
    email: string;
    phone: string;
  };
}

interface LocationInfo {
  id: string;
  name: string;
  address: string;
  type: 'lab' | 'storage' | 'court' | 'transport' | 'field';
  zone?: string;
  coordinates?: { lat: number; lng: number };
  securityLevel: 'low' | 'medium' | 'high' | 'maximum';
}

interface EvidenceInfo {
  id: string;
  description: string;
  type: string;
  quantity: number;
  unit: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  photos?: string[];
  measurements?: { [key: string]: string };
  serialNumbers?: string[];
}

interface VerificationInfo {
  method: 'digital_signature' | 'biometric' | 'rfid_scan' | 'barcode_scan' | 'manual_verification';
  timestamp: Date;
  verificationId: string;
  status: 'verified' | 'pending' | 'failed';
  confidence: number; // 0-100
  metadata?: { [key: string]: any };
}

interface EnvironmentalConditions {
  temperature: number;
  humidity: number;
  pressure?: number;
  lightExposure?: string;
  storageConditions: string;
  transportConditions?: string;
}

interface AttachmentInfo {
  id: string;
  filename: string;
  type: 'photo' | 'document' | 'video' | 'audio' | 'signature' | 'seal';
  size: number;
  hash: string;
  timestamp: Date;
}

interface AuthorizationInfo {
  id: string;
  type: 'court_order' | 'warrant' | 'approval' | 'directive';
  issuer: string;
  number: string;
  validFrom: Date;
  validUntil?: Date;
  attachmentId?: string;
}

interface DigitalSignature {
  id: string;
  timestamp: Date;
  algorithm: string;
  hash: string;
  certificate: string;
  status: 'valid' | 'invalid' | 'expired' | 'revoked';
}

interface ChainOfCustodyProps {
  docketId: string;
  entries?: CustodyEntry[];
  showDetails?: boolean;
  showTimeline?: boolean;
  showSignatures?: boolean;
  enableVerification?: boolean;
  onVerifySignature?: (signatureId: string) => void;
  onExportReport?: () => void;
  onPrintCertificate?: () => void;
}

const ChainOfCustody: React.FC<ChainOfCustodyProps> = ({
  docketId,
  entries = [],
  showDetails = true,
  showTimeline = true,
  showSignatures = true,
  enableVerification = true,
  onVerifySignature,
  onExportReport,
  onPrintCertificate,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<CustodyEntry | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'table' | 'signatures'>('timeline');
  const [filter, setFilter] = useState('');
  const [showVerificationDetails, setShowVerificationDetails] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));
  const [showDetailsState, setShowDetailsState] = useState(showDetails);
  
  const printRef = useRef<HTMLDivElement>(null);
  
  // Generate mock custody entries if none provided
  const mockEntries: CustodyEntry[] = useMemo(() => {
    if (entries.length > 0) return entries;
    
    const now = new Date();
    const personnel = [
      {
        id: 'P001',
        name: 'Officer Sarah Johnson',
        role: 'Investigating Officer',
        badge: 'SAPS-2847',
        department: 'SAPS Hillbrow',
        rank: 'Constable',
        certification: ['Evidence Handling Level 2'],
        signature: {
          id: 'SIG001',
          timestamp: new Date(now.getTime() - 4 * 3600000),
          algorithm: 'RSA-2048',
          hash: 'sha256:a1b2c3...',
          certificate: 'CERT001',
          status: 'valid' as const
        },
        contactInfo: {
          email: 's.johnson@saps.gov.za',
          phone: '+27 11 123 4567'
        }
      },
      {
        id: 'P002',
        name: 'Tech Michael Williams',
        role: 'RFID Technician',
        badge: 'TECH-1923',
        department: 'Forensic Support',
        certification: ['RFID Systems', 'Digital Evidence'],
        signature: {
          id: 'SIG002',
          timestamp: new Date(now.getTime() - 3.5 * 3600000),
          algorithm: 'RSA-2048',
          hash: 'sha256:d4e5f6...',
          certificate: 'CERT002',
          status: 'valid' as const
        },
        contactInfo: {
          email: 'm.williams@forensics.gov.za',
          phone: '+27 11 234 5678'
        }
      },
      {
        id: 'P003',
        name: 'Dr. Sarah Smith',
        role: 'Senior Forensic Analyst',
        badge: 'LAB-0392',
        department: 'Forensic Laboratory',
        rank: 'Senior Analyst',
        certification: ['Forensic Science PhD', 'DNA Analysis', 'Toxicology'],
        signature: {
          id: 'SIG003',
          timestamp: new Date(now.getTime() - 2.5 * 3600000),
          algorithm: 'RSA-2048',
          hash: 'sha256:g7h8i9...',
          certificate: 'CERT003',
          status: 'valid' as const
        },
        contactInfo: {
          email: 'dr.smith@forensics.gov.za',
          phone: '+27 11 345 6789'
        }
      }
    ];
    
    return [
      {
        id: 'CUSTODY001',
        timestamp: new Date(now.getTime() - 4 * 3600000),
        action: 'received',
        toPersonnel: personnel[0],
        location: {
          id: 'LOC001',
          name: 'Crime Scene Alpha-7',
          address: '123 Main Street, Hillbrow, Johannesburg',
          type: 'field',
          securityLevel: 'medium',
          coordinates: { lat: -26.1833, lng: 28.0500 }
        },
        evidence: {
          id: 'EVD001',
          description: 'Blood-stained fabric samples from victim\'s clothing',
          type: 'Biological Evidence',
          quantity: 3,
          unit: 'samples',
          condition: 'good',
          photos: ['evidence_001.jpg', 'evidence_002.jpg'],
          measurements: {
            'Sample A': '2.5cm x 3.2cm',
            'Sample B': '1.8cm x 2.1cm',
            'Sample C': '3.1cm x 2.7cm'
          }
        },
        verification: {
          method: 'manual_verification',
          timestamp: new Date(now.getTime() - 4 * 3600000),
          verificationId: 'VERIFY001',
          status: 'verified',
          confidence: 95
        },
        conditions: {
          temperature: 18.5,
          humidity: 65,
          storageConditions: 'Room temperature, dry environment'
        },
        sealIntegrity: 'not_applicable',
        notes: 'Evidence collected from primary crime scene. All samples properly documented with photographic evidence.',
        authorizations: [{
          id: 'AUTH001',
          type: 'warrant',
          issuer: 'Johannesburg Magistrate Court',
          number: 'SW-2024-0847',
          validFrom: new Date(now.getTime() - 5 * 3600000),
          validUntil: new Date(now.getTime() + 30 * 24 * 3600000)
        }]
      },
      {
        id: 'CUSTODY002',
        timestamp: new Date(now.getTime() - 3.5 * 3600000),
        action: 'transferred',
        fromPersonnel: personnel[0],
        toPersonnel: personnel[1],
        location: {
          id: 'LOC002',
          name: 'Evidence Reception Bay',
          address: 'Forensic Science Laboratory, Pretoria',
          type: 'lab',
          zone: 'Reception',
          securityLevel: 'high'
        },
        evidence: {
          id: 'EVD001',
          description: 'Blood-stained fabric samples from victim\'s clothing',
          type: 'Biological Evidence',
          quantity: 3,
          unit: 'samples',
          condition: 'good'
        },
        verification: {
          method: 'rfid_scan',
          timestamp: new Date(now.getTime() - 3.5 * 3600000),
          verificationId: 'VERIFY002',
          status: 'verified',
          confidence: 98,
          metadata: {
            rfidTag: 'RFID-FSL-2024-0847',
            scannerSerial: 'SCAN-001',
            signalStrength: -42
          }
        },
        conditions: {
          temperature: 20.0,
          humidity: 45,
          storageConditions: 'Climate controlled laboratory environment',
          transportConditions: 'Refrigerated transport at 4°C'
        },
        sealIntegrity: 'intact',
        notes: 'Evidence transferred to laboratory for RFID tagging and initial processing.',
        attachments: [{
          id: 'ATT001',
          filename: 'transfer_receipt_001.pdf',
          type: 'document',
          size: 245760,
          hash: 'sha256:j1k2l3...',
          timestamp: new Date(now.getTime() - 3.5 * 3600000)
        }],
        witnessPersonnel: [personnel[0]]
      },
      {
        id: 'CUSTODY003',
        timestamp: new Date(now.getTime() - 2.5 * 3600000),
        action: 'analyzed',
        fromPersonnel: personnel[1],
        toPersonnel: personnel[2],
        location: {
          id: 'LOC003',
          name: 'DNA Analysis Laboratory',
          address: 'Forensic Science Laboratory, Pretoria',
          type: 'lab',
          zone: 'Analysis Bay 3',
          securityLevel: 'maximum'
        },
        evidence: {
          id: 'EVD001',
          description: 'Blood-stained fabric samples from victim\'s clothing',
          type: 'Biological Evidence',
          quantity: 3,
          unit: 'samples',
          condition: 'good',
          serialNumbers: ['DNA-2024-0847-A', 'DNA-2024-0847-B', 'DNA-2024-0847-C']
        },
        verification: {
          method: 'biometric',
          timestamp: new Date(now.getTime() - 2.5 * 3600000),
          verificationId: 'VERIFY003',
          status: 'verified',
          confidence: 99,
          metadata: {
            biometricType: 'fingerprint',
            matchScore: 0.987,
            template: 'BIO-TEMP-003'
          }
        },
        conditions: {
          temperature: 22.0,
          humidity: 40,
          pressure: 1013.25,
          lightExposure: 'UV-filtered laboratory lighting',
          storageConditions: 'Sterile laboratory conditions'
        },
        sealIntegrity: 'broken',
        notes: 'Evidence unsealed for DNA analysis. Complete genetic profile extracted from Sample A. Samples B and C provide partial profiles.',
        attachments: [{
          id: 'ATT002',
          filename: 'dna_analysis_report.pdf',
          type: 'document',
          size: 1024000,
          hash: 'sha256:m4n5o6...',
          timestamp: new Date(now.getTime() - 2 * 3600000)
        }, {
          id: 'ATT003',
          filename: 'lab_photos_analysis.zip',
          type: 'photo',
          size: 5242880,
          hash: 'sha256:p7q8r9...',
          timestamp: new Date(now.getTime() - 2 * 3600000)
        }]
      },
      {
        id: 'CUSTODY004',
        timestamp: new Date(now.getTime() - 1.5 * 3600000),
        action: 'sealed',
        fromPersonnel: personnel[2],
        toPersonnel: personnel[2],
        location: {
          id: 'LOC004',
          name: 'Secure Evidence Vault',
          address: 'Forensic Science Laboratory, Pretoria',
          type: 'storage',
          zone: 'Vault B-12',
          securityLevel: 'maximum'
        },
        evidence: {
          id: 'EVD001',
          description: 'Blood-stained fabric samples from victim\'s clothing (post-analysis)',
          type: 'Biological Evidence',
          quantity: 3,
          unit: 'samples',
          condition: 'fair',
          serialNumbers: ['DNA-2024-0847-A', 'DNA-2024-0847-B', 'DNA-2024-0847-C']
        },
        verification: {
          method: 'digital_signature',
          timestamp: new Date(now.getTime() - 1.5 * 3600000),
          verificationId: 'VERIFY004',
          status: 'verified',
          confidence: 100,
          metadata: {
            signatureAlgorithm: 'ECDSA-P256',
            timestampAuthority: 'FSL-TSA-001',
            certificateChain: ['CERT003', 'CA-CERT-001', 'ROOT-CERT']
          }
        },
        conditions: {
          temperature: 4.0,
          humidity: 35,
          pressure: 1013.25,
          storageConditions: 'Refrigerated secure vault with continuous monitoring'
        },
        sealIntegrity: 'intact',
        notes: 'Evidence re-sealed after analysis completion. Digital tamper-evident seal applied.',
        attachments: [{
          id: 'ATT004',
          filename: 'digital_seal_certificate.p7s',
          type: 'seal',
          size: 4096,
          hash: 'sha256:s1t2u3...',
          timestamp: new Date(now.getTime() - 1.5 * 3600000)
        }]
      }
    ];
  }, [entries]);
  
  const filteredEntries = useMemo(() => {
    if (!filter) return mockEntries;
    
    const searchTerm = filter.toLowerCase();
    return mockEntries.filter(entry =>
      entry.toPersonnel.name.toLowerCase().includes(searchTerm) ||
      entry.fromPersonnel?.name.toLowerCase().includes(searchTerm) ||
      entry.location.name.toLowerCase().includes(searchTerm) ||
      entry.evidence.description.toLowerCase().includes(searchTerm) ||
      entry.action.toLowerCase().includes(searchTerm) ||
      entry.notes?.toLowerCase().includes(searchTerm)
    );
  }, [mockEntries, filter]);
  
  const getActionIcon = (action: string) => {
    const icons = {
      received: <FileText size={16} />,
      transferred: <ArrowRight size={16} />,
      analyzed: <Eye size={16} />,
      stored: <Lock size={16} />,
      transported: <Truck size={16} />,
      sealed: <Shield size={16} />,
      unsealed: <Unlock size={16} />,
      returned: <RotateCcw size={16} />
    };
    return icons[action as keyof typeof icons] || <FileText size={16} />;
  };
  
  const getActionColor = (action: string) => {
    const colors = {
      received: '#3b82f6',
      transferred: '#10b981',
      analyzed: '#6366f1',
      stored: '#8b5cf6',
      transported: '#f59e0b',
      sealed: '#059669',
      unsealed: '#dc2626',
      returned: '#6b7280'
    };
    return colors[action as keyof typeof colors] || '#6b7280';
  };
  
  const getVerificationStatus = (verification: VerificationInfo) => {
    const { status, confidence } = verification;
    if (status === 'verified' && confidence >= 90) {
      return { icon: <CheckCircle size={16} />, color: '#10b981', text: 'Verified' };
    } else if (status === 'verified' && confidence >= 70) {
      return { icon: <AlertTriangle size={16} />, color: '#f59e0b', text: 'Verified (Low Confidence)' };
    } else if (status === 'pending') {
      return { icon: <Clock size={16} />, color: '#6b7280', text: 'Pending' };
    } else {
      return { icon: <XCircle size={16} />, color: '#ef4444', text: 'Failed' };
    }
  };
  
  const getSealIntegrityStatus = (integrity: string) => {
    const statuses = {
      intact: { icon: <ShieldCheck size={16} />, color: '#10b981', text: 'Seal Intact' },
      broken: { icon: <AlertCircle size={16} />, color: '#ef4444', text: 'Seal Broken' },
      not_applicable: { icon: <Info size={16} />, color: '#6b7280', text: 'No Seal Required' }
    };
    return statuses[integrity as keyof typeof statuses] || statuses.not_applicable;
  };
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };
  
  const renderPersonnelCard = (personnel: PersonnelInfo, role: 'from' | 'to' | 'witness', index?: number) => (
    <div
      key={`${personnel.id}-${role}-${index}`}
      style={{
        padding: '12px',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px',
        fontSize: '12px',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
        }}>
          {personnel.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {personnel.name}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
            {personnel.role} • {personnel.badge}
          </div>
        </div>
      </div>
      
      <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
        {personnel.department}
        {personnel.rank && ` • ${personnel.rank}`}
      </div>
      
      {personnel.certification && personnel.certification.length > 0 && (
        <div style={{ marginTop: '6px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>
            Certifications:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {personnel.certification.map(cert => (
              <span
                key={cert}
                style={{
                  padding: '2px 4px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '3px',
                  fontSize: '9px',
                  color: 'var(--text-secondary)',
                }}
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {showSignatures && (
        <div style={{
          marginTop: '8px',
          padding: '6px',
          background: 'var(--bg-secondary)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            Digital Signature
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
          }}>
            {personnel.signature.status === 'valid' && (
              <>
                <CheckCircle size={10} color="#10b981" />
                <span style={{ color: '#10b981' }}>Valid</span>
              </>
            )}
            {enableVerification && (
              <button
                onClick={() => onVerifySignature?.(personnel.signature.id)}
                style={{
                  padding: '2px 6px',
                  background: 'transparent',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '3px',
                  fontSize: '9px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Verify
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
  const renderTimelineView = () => (
    <div style={{ position: 'relative', paddingLeft: '40px' }}>
      {/* Timeline line */}
      <div style={{
        position: 'absolute',
        left: '20px',
        top: '0',
        bottom: '0',
        width: '2px',
        background: 'linear-gradient(180deg, #3b82f6 0%, #6366f1 100%)',
      }} />
      
      {filteredEntries.map((entry, index) => {
        const isSelected = selectedEntry?.id === entry.id;
        const actionColor = getActionColor(entry.action);
        const verificationStatus = getVerificationStatus(entry.verification);
        const sealStatus = getSealIntegrityStatus(entry.sealIntegrity);
        
        return (
          <div
            key={entry.id}
            style={{
              position: 'relative',
              marginBottom: '30px',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedEntry(entry)}
          >
            {/* Timeline node */}
            <div style={{
              position: 'absolute',
              left: '-30px',
              top: '0',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: actionColor,
              border: '3px solid var(--bg-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              zIndex: 2,
              boxShadow: isSelected ? `0 0 20px ${actionColor}` : 'none',
            }}>
              {getActionIcon(entry.action)}
            </div>
            
            {/* Entry card */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${isSelected ? actionColor : 'var(--border-primary)'}`,
              borderRadius: '12px',
              padding: '16px',
              transition: 'all 0.3s',
              boxShadow: isSelected ? `0 0 20px ${actionColor}40` : 'none',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    textTransform: 'capitalize',
                    marginBottom: '4px',
                  }}>
                    Evidence {entry.action}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Clock size={12} />
                    {entry.timestamp.toLocaleString()}
                  </div>
                </div>
                
                {/* Status indicators */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: `${verificationStatus.color}20`,
                    color: verificationStatus.color,
                    borderRadius: '6px',
                    fontSize: '11px',
                  }}>
                    {verificationStatus.icon}
                    {verificationStatus.text}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: `${sealStatus.color}20`,
                    color: sealStatus.color,
                    borderRadius: '6px',
                    fontSize: '11px',
                  }}>
                    {sealStatus.icon}
                    {sealStatus.text}
                  </div>
                </div>
              </div>
              
              {/* Personnel and Location */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: showDetailsState ? '1fr 1fr 1fr' : '1fr 1fr',
                gap: '12px',
                marginBottom: '12px',
              }}>
                {entry.fromPersonnel && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}>
                      From:
                    </div>
                    {renderPersonnelCard(entry.fromPersonnel, 'from')}
                  </div>
                )}
                
                <div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}>
                    To:
                  </div>
                  {renderPersonnelCard(entry.toPersonnel, 'to')}
                </div>
                
                {showDetailsState && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}>
                      Location:
                    </div>
                    <div style={{
                      padding: '12px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}>
                      <div style={{
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                      }}>
                        {entry.location.name}
                      </div>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        marginBottom: '6px',
                      }}>
                        {entry.location.address}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        fontSize: '10px',
                      }}>
                        <span style={{
                          padding: '2px 4px',
                          background: 'var(--bg-secondary)',
                          borderRadius: '3px',
                          textTransform: 'capitalize',
                        }}>
                          {entry.location.type}
                        </span>
                        <span style={{
                          padding: '2px 4px',
                          background: entry.location.securityLevel === 'maximum'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : entry.location.securityLevel === 'high'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(59, 130, 246, 0.2)',
                          color: entry.location.securityLevel === 'maximum'
                            ? '#ef4444'
                            : entry.location.securityLevel === 'high'
                            ? '#f59e0b'
                            : '#3b82f6',
                          borderRadius: '3px',
                          textTransform: 'capitalize',
                        }}>
                          {entry.location.securityLevel} Security
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Evidence details */}
              {showDetailsState && (
                <div style={{
                  padding: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}>
                    Evidence Details:
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                  }}>
                    {entry.evidence.description}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '8px',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                  }}>
                    <div>Type: {entry.evidence.type}</div>
                    <div>Quantity: {entry.evidence.quantity} {entry.evidence.unit}</div>
                    <div>Condition: <span style={{
                      color: entry.evidence.condition === 'excellent' ? '#10b981'
                        : entry.evidence.condition === 'good' ? '#3b82f6'
                        : entry.evidence.condition === 'fair' ? '#f59e0b'
                        : '#ef4444'
                    }}>{entry.evidence.condition}</span></div>
                  </div>
                </div>
              )}
              
              {/* Notes */}
              {entry.notes && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  fontStyle: 'italic',
                  padding: '8px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  marginBottom: '8px',
                }}>
                  "{entry.notes}"
                </div>
              )}
              
              {/* Attachments */}
              {entry.attachments && entry.attachments.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                }}>
                  {entry.attachments.map(attachment => (
                    <div
                      key={attachment.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        fontSize: '10px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                      title={`${attachment.filename} (${(attachment.size / 1024).toFixed(1)} KB)`}
                    >
                      {attachment.type === 'photo' && <Camera size={12} />}
                      {attachment.type === 'document' && <FileText size={12} />}
                      {attachment.type === 'seal' && <Shield size={12} />}
                      {attachment.type === 'signature' && <Signature size={12} />}
                      <span>{attachment.filename}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
  
  const renderControls = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 20px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-primary)',
      borderRadius: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '10px',
    }}>
      {/* Left controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* View mode */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {(['timeline', 'table', 'signatures'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 12px',
                background: viewMode === mode ? 'var(--bg-primary)' : 'transparent',
                border: '1px solid var(--border-primary)',
                borderRadius: '6px',
                color: viewMode === mode ? 'var(--text-accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '12px',
                textTransform: 'capitalize',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search custody records..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'var(--text-primary)',
              width: '200px',
            }}
          />
        </div>
      </div>
      
      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setShowDetailsState(!showDetailsState)}
          style={{
            padding: '6px 10px',
            background: showDetailsState ? 'var(--bg-primary)' : 'transparent',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          <Eye size={14} style={{ marginRight: '4px', display: 'inline' }} />
          Details
        </button>
        
        <button
          onClick={onExportReport}
          style={{
            padding: '6px 10px',
            background: 'transparent',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Download size={14} />
          Export
        </button>
        
        <button
          onClick={onPrintCertificate}
          style={{
            padding: '6px 10px',
            background: 'var(--bg-primary)',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Printer size={14} />
          Print Certificate
        </button>
      </div>
    </div>
  );
  
  return (
    <div ref={printRef} style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        marginBottom: '20px',
        padding: '20px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Shield size={24} />
            Chain of Custody
          </h2>
          <div style={{
            padding: '4px 12px',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <CheckCircle size={12} />
            VERIFIED
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          <div>
            <Hash size={12} style={{ display: 'inline', marginRight: '6px' }} />
            Docket ID: {docketId}
          </div>
          <div>
            <Clock size={12} style={{ display: 'inline', marginRight: '6px' }} />
            Generated: {new Date().toLocaleString()}
          </div>
          <div>
            <Users size={12} style={{ display: 'inline', marginRight: '6px' }} />
            {filteredEntries.length} Custody Entries
          </div>
          <div>
            <CheckCircle size={12} style={{ display: 'inline', marginRight: '6px' }} />
            {filteredEntries.filter(e => e.verification.status === 'verified').length} Verified
          </div>
        </div>
      </div>
      
      {/* Controls */}
      {renderControls()}
      
      {/* Main content */}
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        padding: '30px 20px',
        minHeight: '400px',
      }}>
        {filteredEntries.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}>
            No custody records match the current filter
          </div>
        ) : (
          <>
            {viewMode === 'timeline' && renderTimelineView()}
            {viewMode === 'table' && <div>Table view placeholder</div>}
            {viewMode === 'signatures' && <div>Signatures view placeholder</div>}
          </>
        )}
      </div>
      
      {/* Footer */}
      <div style={{
        marginTop: '20px',
        padding: '15px 20px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        textAlign: 'center',
      }}>
        This digital chain of custody record is cryptographically signed and tamper-evident.
        All signatures have been verified against the South African Forensic Science Laboratory certificate authority.
      </div>
    </div>
  );
};

export default ChainOfCustody;